package com.floripa.agora.activity;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.floripa.agora.R;
import com.floripa.agora.model.EventoModel;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * Formulário simples de sugestão de evento.
 * Evita cadastro complexo conforme requisitado (Requisito 4).
 * Salva localmente via SharedPreferences em formato JSON.
 */
public class SugerirEventoActivity extends AppCompatActivity {

    private EditText etTitulo, etDescricao, etData, etHora, etLocal, etEndereco, etPrecoValor;
    private Spinner spCategoria, spBairro;
    private RadioGroup rgPreco;
    private RadioButton rbGratuito, rbPago;
    private Button btnSalvar, btnCancelar;

    private static final String PREFS_NAME = "FloripaAgoraPrefs";
    private static final String KEY_SUGERIDOS = "evento_sugerido_list";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sugerir_evento);

        // Instancia as referências do layout
        etTitulo = findViewById(R.id.etTitulo);
        etDescricao = findViewById(R.id.etDescricao);
        etData = findViewById(R.id.etData);
        etHora = findViewById(R.id.etHora);
        etLocal = findViewById(R.id.etLocal);
        etEndereco = findViewById(R.id.etEndereco);
        etPrecoValor = findViewById(R.id.etPrecoValor);

        spCategoria = findViewById(R.id.spCategoria);
        spBairro = findViewById(R.id.spBairro);

        rgPreco = findViewById(R.id.rgPreco);
        rbGratuito = findViewById(R.id.rbGratuito);
        rbPago = findViewById(R.id.rbPago);

        btnSalvar = findViewById(R.id.btnSalvar);
        btnCancelar = findViewById(R.id.btnCancelar);

        // Preenche os Spinners com as categorias e bairros
        ArrayAdapter<CharSequence> adapterCats = ArrayAdapter.createFromResource(this,
                R.array.categorias_array, android.R.layout.simple_spinner_item);
        adapterCats.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spCategoria.setAdapter(adapterCats);

        ArrayAdapter<CharSequence> adapterBairros = ArrayAdapter.createFromResource(this,
                R.array.bairros_array, android.R.layout.simple_spinner_item);
        adapterBairros.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spBairro.setAdapter(adapterBairros);

        // Alterna campo de inserir valor baseado no radio group de preço
        rgPreco.setOnCheckedChangeListener((group, checkedId) -> {
            if (checkedId == R.id.rbPago) {
                etPrecoValor.setVisibility(View.VISIBLE);
            } else {
                etPrecoValor.setVisibility(View.GONE);
                etPrecoValor.setText("");
            }
        });

        // Clique para Cancelar
        btnCancelar.setOnClickListener(v -> finish());

        // Clique para Salvar Sugestão
        btnSalvar.setOnClickListener(v -> salvarSugestao());
    }

    private void salvarSugestao() {
        String titulo = etTitulo.getText().toString().trim();
        String descricao = etDescricao.getText().toString().trim();
        String data = etData.getText().toString().trim(); // YYYY-MM-DD ou formato livre
        String hora = etHora.getText().toString().trim();
        String local = etLocal.getText().toString().trim();
        String endereco = etEndereco.getText().toString().trim();

        if (titulo.isEmpty() || descricao.isEmpty() || data.isEmpty() || hora.isEmpty() || local.isEmpty() || endereco.isEmpty()) {
            Toast.makeText(this, "Por favor, preencha todos os campos obrigatórios!", Toast.LENGTH_SHORT).show();
            return;
        }

        // Calcula preço
        String precoText = "Gratuito";
        if (rbPago.isChecked()) {
            String valor = etPrecoValor.getText().toString().trim();
            if (valor.isEmpty()) {
                Toast.makeText(this, "Por favor, digite o valor de cobrança do ingresso!", Toast.LENGTH_SHORT).show();
                return;
            }
            precoText = "R$ " + valor;
        }

        // Mapeia categoria do Spinner
        String inputCat = spCategoria.getSelectedItem().toString().toLowerCase();
        String finalCat = "shows"; // fallback
        if (inputCat.contains("feira")) finalCat = "feiras";
        else if (inputCat.contains("show")) finalCat = "shows";
        else if (inputCat.contains("esporte")) finalCat = "esportes";
        else if (inputCat.contains("curso")) finalCat = "cursos";
        else finalCat = "outros";

        String bairro = spBairro.getSelectedItem().toString();

        // Cria o ID baseado no timestamp
        String idUnique = "user_" + System.currentTimeMillis();

        // Instancia o novo Evento com a flag comunidade = true (Exigência do Requisito 4)
        EventoModel novoEvento = new EventoModel(
                idUnique,
                titulo,
                descricao,
                finalCat,
                null,
                data,
                hora,
                local,
                bairro,
                endereco,
                -27.5969, // centro de Floripa por padrão
                -48.5494,
                precoText,
                "", // sem imagem url estrita (carregará fallback de categoria padrão)
                false,
                true // comunidade = true
        );

        // Salva localmente via SharedPreferences com Gson (Requisito 4)
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String jsonSugeridos = prefs.getString(KEY_SUGERIDOS, null);
        Gson gson = new Gson();
        List<EventoModel> sugeridos;

        if (jsonSugeridos == null) {
            sugeridos = new ArrayList<>();
        } else {
            Type type = new TypeToken<ArrayList<EventoModel>>(){}.getType();
            sugeridos = gson.fromJson(jsonSugeridos, type);
            if (sugeridos == null) sugeridos = new ArrayList<>();
        }

        sugeridos.add(novoEvento);

        // Persiste a lista atualizada
        String updatedJson = gson.toJson(sugeridos);
        prefs.edit().putString(KEY_SUGERIDOS, updatedJson).apply();

        // Retorna sucesso para atualizar a Activity principal
        setResult(RESULT_OK);
        finish();
    }
}
