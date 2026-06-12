package com.floripa.agora.activity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.floripa.agora.R;
import com.floripa.agora.adapter.EventoAdapter;
import com.floripa.agora.model.EventoModel;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Tela principal do app "Floripa Agora".
 * Permite filtrar por categorias (Feiras, Shows, Esportes, Cursos, Outros, Favoritos)
 * e gerenciar buscas por datas de realização.
 */
public class MainActivity extends AppCompatActivity implements EventoAdapter.OnEventoClickListener {

    private RecyclerView rvEventos;
    private EventoAdapter adapter;
    private List<EventoModel> todosEventos;
    private List<EventoModel> eventosFiltrados;
    private String categoriaSelecionada = "all"; // 'all', 'feiras', 'shows', 'esportes', 'cursos', 'outros', 'favorites'

    private EditText etDataFiltro;
    private Button btnFiltrarData;
    private Button btnSugerirEvento;
    private Button btnMeusFavoritos;

    private static final String PREFS_NAME = "FloripaAgoraPrefs";
    private static final String KEY_FAVORITOS = "favoritos_ids";
    private static final String KEY_SUGERIDOS = "evento_sugerido_list";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Inicializa elementos da View
        rvEventos = findViewById(R.id.rvEventos);
        etDataFiltro = findViewById(R.id.etDataFiltro);
        btnFiltrarData = findViewById(R.id.btnFiltrarData);
        btnSugerirEvento = findViewById(R.id.btnSugerirEvento);
        btnMeusFavoritos = findViewById(R.id.btnMeusFavoritos);

        rvEventos.setLayoutManager(new LinearLayoutManager(this));

        // Inicializa Banco de dados temporário de eventos estáticos combinados com os sugeridos pelo usuário
        carregarEventos();

        // Configura o Adaptador
        eventosFiltrados = new ArrayList<>(todosEventos);
        adapter = new EventoAdapter(eventosFiltrados, this);
        rvEventos.setAdapter(adapter);

        // Configura ouvintes dos botões de categorias
        findViewById(R.id.btnCatFeiras).setOnClickListener(v -> selecionarCategoria("feiras"));
        findViewById(R.id.btnCatShows).setOnClickListener(v -> selecionarCategoria("shows"));
        findViewById(R.id.btnCatEsportes).setOnClickListener(v -> selecionarCategoria("esportes"));
        findViewById(R.id.btnCatCursos).setOnClickListener(v -> selecionarCategoria("cursos"));
        findViewById(R.id.btnCatOutros).setOnClickListener(v -> selecionarCategoria("outros"));

        // Botão Meus Favoritos (Requisito 3)
        btnMeusFavoritos.setOnClickListener(v -> selecionarCategoria("favorites"));

        // Botão para Filtrar por Data digitada
        btnFiltrarData.setOnClickListener(v -> {
            String dataDigitada = etDataFiltro.getText().toString().trim();
            filtrarLista(dataDigitada);
        });

        // Botão para Sugerir Evento (Abre dialog / formulário de sugestão)
        btnSugerirEvento.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, SugerirEventoActivity.class);
            startActivityForResult(intent, 200);
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Recarrega todos os eventos (para caso algum tenha sido excluído na tela de detalhes)
        carregarEventos();
        aplicarFiltros();
    }

    /**
     * Altera a categoria ativa do applet e atualiza a interface.
     */
    private void selecionarCategoria(String categoria) {
        this.categoriaSelecionada = categoria;
        aplicarFiltros();
        Toast.makeText(this, "Categoria selecionada: " + categoria.toUpperCase(), Toast.LENGTH_SHORT).show();
    }

    /**
     * Aplica filtros combinados de categoria selecionada e favoritos do usuário.
     */
    private void aplicarFiltros() {
        String dataDigitada = etDataFiltro.getText().toString().trim();
        filtrarLista(dataDigitada);
    }

    /**
     * Filtra a lista principal de eventos baseando-se na categoria ativa e na data digitada.
     */
    private void filtrarLista(String dataFiltro) {
        eventosFiltrados.clear();
        Set<String> favoritos = obterFavoritosIds();

        for (EventoModel evento : todosEventos) {
            // 1. Filtragem por Categoria
            if (!categoriaSelecionada.equals("all")) {
                if (categoriaSelecionada.equals("favorites")) {
                    if (!favoritos.contains(evento.getId())) {
                        continue;
                    }
                } else if (!evento.getCategory().equalsIgnoreCase(categoriaSelecionada)) {
                    continue;
                }
            }

            // 2. Filtragem por Data Formatada
            if (!dataFiltro.isEmpty()) {
                // Converte a data do filtro (DD/MM/YYYY) para ISO (YYYY-MM-DD) se necessário
                String dataIso = formatFiltroParaIso(dataFiltro);
                if (!evento.getDate().equals(dataIso) && !evento.getDate().equals(dataFiltro)) {
                    continue;
                }
            }

            eventosFiltrados.add(evento);
        }
        adapter.setEventos(eventosFiltrados);
    }

    private String formatFiltroParaIso(String dateStr) {
        if (dateStr.contains("/")) {
            String[] parts = dateStr.split("/");
            if (parts.length == 3) {
                return parts[2] + "-" + parts[1] + "-" + parts[0];
            }
        }
        return dateStr;
    }

    /**
     * Carrega a coleção padrão unindo com os sugeridos pelo usuário no SharedPreferences.
     */
    private void carregarEventos() {
        todosEventos = new ArrayList<>();

        // Adiciona 3 Eventos padrão de fábrica
        todosEventos.add(new EventoModel("s1", "Projeto Mini Tour - Especial Soul Brasileiro", 
                "Noite musical emocionante celebrando clássicos da soul music brasileira no Teatro Pedro Ivo.", 
                "shows", "Música popular", "2026-05-21", "20:00", "Teatro Pedro Ivo", "Saco Grande", 
                "Rodovia SC-401, Km 15", -27.5485, -48.5042, "A partir de R$ 30", "", true, false));

        todosEventos.add(new EventoModel("f1", "Feira de camisas de futebol de Florianópolis", 
                "Espaço reservado para colecionadores, expositores e admiradores trocarem e negociarem uniformes históricos.", 
                "feiras", "Artesanato e Vestuário", "2026-03-14", "09:00", "Largo da Alfândega", "Centro", 
                "Rua Deodoro, s/n", -27.5969, -48.5494, "Entrada Gratuita", "", false, false));

        todosEventos.add(new EventoModel("e1", "Transmissão da Copa do Mundo em Florianópolis", 
                "Super telão e atrações especiais na praça de alimentação para assistir aos jogos do Brasil.", 
                "esportes", "Futebol", "2026-06-11", "10:00", "Villa Romana Shopping", "Santa Mônica", 
                "Av. Madre Benvenuta, 687", -27.5862, -48.5229, "Gratuito", "", true, false));

        // Carrega registros sugeridos salvos localmente sob a flag comunidade = true (Requisito 4)
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String jsonSugeridos = prefs.getString(KEY_SUGERIDOS, null);
        if (jsonSugeridos != null) {
            Gson gson = new Gson();
            Type type = new TypeToken<ArrayList<EventoModel>>(){}.getType();
            List<EventoModel> sugeridos = gson.fromJson(jsonSugeridos, type);
            if (sugeridos != null) {
                List<EventoModel> filtrados = new ArrayList<>();
                boolean alterado = false;
                for (EventoModel e : sugeridos) {
                    if (e.getTitle() != null && e.getTitle().equalsIgnoreCase("feira de artigos culturais")) {
                        alterado = true;
                    } else {
                        filtrados.add(e);
                    }
                }
                if (alterado) {
                    prefs.edit().putString(KEY_SUGERIDOS, gson.toJson(filtrados)).apply();
                    sugeridos = filtrados;
                }
                for (EventoModel e : sugeridos) {
                    e.setComunidade(true); // Garante a flag
                    todosEventos.add(0, e); // Coloca em evidência no topo
                }
            }
        }
    }

    /**
     * Obtem do SharedPreferences os IDs correspondentes aos favoritos (Requisito 3)
     */
    private Set<String> obterFavoritosIds() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        return prefs.getStringSet(KEY_FAVORITOS, new HashSet<String>());
    }

    @Override
    public void onEventoClick(EventoModel evento) {
        // Redireciona para exibir detalhes
        Intent intent = new Intent(this, EventoDetalheActivity.class);
        intent.putExtra("evento", evento);
        startActivity(intent);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 200 && resultCode == RESULT_OK) {
            Toast.makeText(this, "Show! Novo evento sugerido com sucesso localmente!", Toast.LENGTH_LONG).show();
            carregarEventos();
            aplicarFiltros();
        }
    }
}
