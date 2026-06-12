package com.floripa.agora.activity;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.bumptech.glide.Glide;
import com.floripa.agora.R;
import com.floripa.agora.model.EventoModel;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Exibe detalhes do evento selecionado.
 * Implementa Glide para carregamento de imagens com fallback por categoria (Requisito 2).
 * Controla status de favoritos por Id de forma permanente (Requisito 3).
 * Oferece botão para deletar eventos sugeridos pelo usuário no celular (Requisito 4).
 */
public class EventoDetalheActivity extends AppCompatActivity {

    private ImageView ivBanner;
    private TextView tvTags, tvTituloDetail, tvDescricaoDetail, tvDataHora, tvLocalizacao, tvPreco;
    private Button btnFavorito, btnCompartilhar, btnExcluir;

    private EventoModel evento;
    private boolean isFavorite = false;

    private static final String PREFS_NAME = "FloripaAgoraPrefs";
    private static final String KEY_FAVORITOS = "favoritos_ids";
    private static final String KEY_SUGERIDOS = "evento_sugerido_list";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_evento_detalhe);

        // Instancia os elementos do Layout
        ivBanner = findViewById(R.id.ivBanner);
        tvTags = findViewById(R.id.tvTags);
        tvTituloDetail = findViewById(R.id.tvTituloDetail);
        tvDescricaoDetail = findViewById(R.id.tvDescricaoDetail);
        tvDataHora = findViewById(R.id.tvDataHora);
        tvLocalizacao = findViewById(R.id.tvLocalizacao);
        tvPreco = findViewById(R.id.tvPreco);

        btnFavorito = findViewById(R.id.btnFavorito);
        btnCompartilhar = findViewById(R.id.btnCompartilhar);
        btnExcluir = findViewById(R.id.btnExcluir);

        // Obtém o objeto evento enviado na intent
        evento = (EventoModel) getIntent().getSerializableExtra("evento");

        if (evento == null) {
            Toast.makeText(this, "Erro ao carregar detalhes do evento!", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        // Preenche campos de texto básico
        tvTituloDetail.setText(evento.getTitle());
        tvDescricaoDetail.setText(evento.getDescription());
        tvDataHora.setText("📅 Data: " + reformatDate(evento.getDate()) + "\n⏰ Início: " + evento.getTime() + "h");
        tvLocalizacao.setText("📍 Local: " + evento.getLocationName() + "\n" + evento.getAddress() + " • " + evento.getNeighborhood());
        tvPreco.setText("💰 Ingresso: " + evento.getPrice());
        tvTags.setText(evento.getCategory().toUpperCase());

        // Lógica de Carregamento Inteligente de Imagem (Requisito 2)
        int drawableFallback = getFallbackDrawableByCategory(evento.getCategory());

        if (evento.getImageUrl() == null || evento.getImageUrl().trim().isEmpty()) {
            // Se imagem vier nula ou vazia, carrega padrão local de categoria
            Glide.with(this)
                    .load(drawableFallback)
                    .into(ivBanner);
        } else {
            // Carrega imagem da API pelo Glide. Se falhar ou demorar, usa drawable local correspondente
            Glide.with(this)
                    .load(evento.getImageUrl())
                    .placeholder(drawableFallback) // imagem estática enquanto carrega
                    .error(drawableFallback)       // imagem estática caso a requisição falhe
                    .centerCrop()
                    .into(ivBanner);
        }

        // Verifica estado de Favorito no SharedPreferences (Requisito 3)
        atualizarEstadoFavorito();

        // Controla exibição do botão Excluir Evento (Requisito 4)
        if (evento.isComunidade()) {
            btnExcluir.setVisibility(View.VISIBLE);
        } else {
            btnExcluir.setVisibility(View.GONE);
        }

        // Listener de Favorito
        btnFavorito.setOnClickListener(v -> alternarFavorito());

        // Listener de Compartilhamento
        btnCompartilhar.setOnClickListener(v -> compartilharEvento());

        // Listener de Exclusão (Requisito 4)
        btnExcluir.setOnClickListener(v -> confirmaExclusao());
    }

    private void atualizarEstadoFavorito() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        Set<String> favoritos = prefs.getStringSet(KEY_FAVORITOS, new HashSet<String>());
        isFavorite = favoritos.contains(evento.getId());

        if (isFavorite) {
            btnFavorito.setText("⭐ Favoritado");
            btnFavorito.setCompoundDrawablesWithIntrinsicBounds(android.R.drawable.star_on, 0, 0, 0);
        } else {
            btnFavorito.setText("☆ Favoritar");
            btnFavorito.setCompoundDrawablesWithIntrinsicBounds(android.R.drawable.star_off, 0, 0, 0);
        }
    }

    private void alternarFavorito() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        Set<String> favoritos = new HashSet<>(prefs.getStringSet(KEY_FAVORITOS, new HashSet<String>()));

        if (isFavorite) {
            favoritos.remove(evento.getId());
            Toast.makeText(this, "Removido dos meus Favoritos!", Toast.LENGTH_SHORT).show();
        } else {
            favoritos.add(evento.getId());
            Toast.makeText(this, "Adicionado aos meus Favoritos!", Toast.LENGTH_SHORT).show();
        }

        prefs.edit().putStringSet(KEY_FAVORITOS, favoritos).apply();
        atualizarEstadoFavorito();
    }

    private void compartilharEvento() {
        String msg = "🎟️ Floripa Agora: " + evento.getTitle() + "\n" +
                "📅 Data: " + reformatDate(evento.getDate()) + " às " + evento.getTime() + "h\n" +
                "📍 Local: " + evento.getLocationName() + "\n" +
                "💰 " + evento.getPrice();

        android.content.Intent sendIntent = new android.content.Intent();
        sendIntent.setAction(android.content.Intent.ACTION_SEND);
        sendIntent.putExtra(android.content.Intent.EXTRA_TEXT, msg);
        sendIntent.setType("text/plain");
        startActivity(android.content.Intent.createChooser(sendIntent, "Compartilhar Evento via:"));
    }

    private void confirmaExclusao() {
        new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle("Remover Evento Sugerido")
                .setMessage("Você quer mesmo excluir este evento sugerido do cache do seu aplicativo?")
                .setPositiveButton("Sim, Excluir", (dialog, which) -> deletarEventoLocal())
                .setNegativeButton("Não", null)
                .show();
    }

    private void deletarEventoLocal() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String jsonSugeridos = prefs.getString(KEY_SUGERIDOS, null);

        if (jsonSugeridos != null) {
            Gson gson = new Gson();
            Type type = new TypeToken<ArrayList<EventoModel>>(){}.getType();
            List<EventoModel> sugeridos = gson.fromJson(jsonSugeridos, type);

            if (sugeridos != null) {
                EventoModel itemARemover = null;
                for (EventoModel e : sugeridos) {
                    if (e.getId().equals(evento.getId())) {
                        itemARemover = e;
                        break;
                    }
                }

                if (itemARemover != null) {
                    sugeridos.remove(itemARemover);
                    String updatedJson = gson.toJson(sugeridos);
                    prefs.edit().putString(KEY_SUGERIDOS, updatedJson).apply();

                    // Remove também dos favoritos se estiver favoritado
                    Set<String> favoritos = new HashSet<>(prefs.getStringSet(KEY_FAVORITOS, new HashSet<String>()));
                    if (favoritos.contains(evento.getId())) {
                        favoritos.remove(evento.getId());
                        prefs.edit().putStringSet(KEY_FAVORITOS, favoritos).apply();
                    }

                    Toast.makeText(this, "Evento excluído com sucesso do dispositivo!", Toast.LENGTH_SHORT).show();
                    finish(); // Fecha a tela de detalhe e volta atualizado
                }
            }
        }
    }

    /**
     * Retorna o drawable local correto correspondente à categoria solicitada.
     * Atende ao Requisito 2 (fallback de imagem para evitar fundos cinzas ou quebras).
     */
    private int getFallbackDrawableByCategory(String category) {
        if (category == null) return R.drawable.fallback_outros;
        switch (category.toLowerCase()) {
            case "feiras":
                return R.drawable.fallback_feiras;
            case "shows":
                return R.drawable.fallback_shows;
            case "esportes":
                return R.drawable.fallback_esportes;
            case "cursos":
                return R.drawable.fallback_cursos;
            default:
                return R.drawable.fallback_outros;
        }
    }

    private String reformatDate(String date) {
        if (date == null || !date.contains("-")) return date;
        String[] parts = date.split("-");
        if (parts.length == 3) {
            return parts[2] + "/" + parts[1] + "/" + parts[0];
        }
        return date;
    }
}
