# Guia de Integração Android Nativo (Java) - Floripa Agora

Este subdiretório contém o código-fonte **Java nativo** e os respectivos **arquivos XML de Layout** para o aplicativo "Floripa Agora" (Agenda Cultural de Florianópolis), atendendo rigorosamente a todos os requisitos solicitados.

---

## 📂 Estrutura de Arquivos Criados

```text
/android_java_code/
├── java/
│   ├── activity/
│   │   ├── MainActivity.java           # Controla filtros por categorias, data e botões de ação
│   │   ├── SugerirEventoActivity.java   # Formulário local sem cadastro para sugerir novos eventos
│   │   └── EventoDetalheActivity.java  # Detalhes, Glide com fallback, favoritos, e botão para Excluir
│   ├── adapter/
│   │   └── EventoAdapter.java         # Liga a lista de eventos com o RecyclerView e adiciona tags
│   └── model/
│       └── EventoModel.java           # Modelo de dados contendo o atributo 'comunidade'
└── res/
    └── layout/
        ├── activity_main.xml           # Layout com botões de categorias e input de data
        ├── activity_sugerir_evento.xml # Formulário para inserção de novos eventos
        ├── activity_evento_detalhe.xml# Layout da tela de detalhes com imagem, infos e botões
        └── item_evento.xml             # Visual de cada linha da lista contendo as badges e tags
```

---

## 🛠️ Configuração Inicial das Dependências

Adicione as seguintes dependências no arquivo `build.gradle` (módulo :app) do seu projeto no Android Studio para dar suporte à serialização JSON (GSON) e carregamento de imagens de forma robusta e otimizada (GLIDE):

```groovy
dependencies {
    // Componentes Android Jetpack
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.9.0'
    implementation 'androidx.recyclerview:recyclerview:1.3.0'

    // Google GSON para salvar objetos complexos no SharedPreferences de forma simples
    implementation 'com.google.code.gson:gson:2.10.1'

    // Glide para download e cache inteligente de imagens da API
    implementation 'com.github.bumptech.glide:glide:4.15.1'
    annotationProcessor 'com.github.bumptech.glide:compiler:4.15.1'
}
```

---

## 🎯 Como os Requisitos foram Resolvidos na Arquitetura Java:

### 1. Arquitetura em Java (Obrigatório)
Fornecidos códigos completos e desacoplados utilizando padrões modernos do Android SDK, usando as classes `AppCompatActivity`, `RecyclerView.Adapter`, layouts XML limpos e estruturados, controle de permissões de internet e transição por `Intent` serializável.

### 2. Correção das Imagens de Detalhe (Visual Fallback)
Mapeado na classe `EventoDetalheActivity.java`, usamos o framework **Glide** com carregamento condicional. 
Se a URL fornecida pela API estiver vazia ou nula, ou se a requisição de rede falhar (HTTP timeout, etc.), o Glide detecta e aciona os métodos `.placeholder(drawableFallback)` e `.error(drawableFallback)` carregando recursos locais correspondentes à categoria do evento (Shows, Cursos, Feiras, Esportes, Outros), garantindo que a tela nunca quebre ou apresente fundos vazios.

### 3. Tela e Fluxo de Favoritos permanentemente salvos
Implementado via `SharedPreferences` usando `StringSet` na `MainActivity` e `EventoDetalheActivity`. 
O usuário clica em "Favoritar" e o ID do evento é adicionado ou removido no arquivo de cache local do dispositivo. Clicando no novo botão **"Meus Favoritos"** presente na interface principal, a lista é reordenada e filtrada para apresentar somente os itens salvos.

### 4. Sugerir Novo Evento (Sem Cadastro Complexo e com Exclusão)
- **Criação**: No `SugerirEventoActivity.java`, ao salvar o evento, instanciamos a classe `EventoModel` com o atributo `comunidade = true`. O evento é serializado em String JSON por meio da biblioteca **GSON** e armazenado em uma Lista persistente dentro do `SharedPreferences`.
- **Identificação**: O `EventoAdapter.java` faz a leitura dessa flag e renderiza dinamicamente a badge de visualização: **`👥 Sugerido por usuário`** para destacar a contribuição da comunidade.
- **Deleção**: Na classe `EventoDetalheActivity.java`, o botão vermelho **"Excluir Evento"** só se torna visível se `evento.isComunidade() == true`. Ao ser acionado pelo usuário nesse dispositivo, ele remove o ID correspondente da lista JSON local do SharedPreferences e encerra a Activity, atualizando instantaneamente a tela inicial.

---

## 🚀 Como Copiar para o Android Studio:
1. Crie os pacotes no seu projeto Java (`com.floripa.agora.model`, `com.floripa.agora.adapter`, `com.floripa.agora.activity`).
2. Cole os arquivos Java correspondentes do subdiretório em seus respectivos pacotes.
3. Copie as declarações XML de layout para `/app/src/main/res/layout/`.
4. Adicione no `/app/src/main/res/values/strings.xml` os arrays utilizados pelos spinners de bairro e categoria:
```xml
<resources>
    <string-array name="categorias_array">
        <item>Shows</item>
        <item>Feiras</item>
        <item>Esportes</item>
        <item>Cursos</item>
        <item>Outros</item>
    </string-array>
    
    <string-array name="bairros_array">
        <item>Centro</item>
        <item>Agronômica</item>
        <item>Trindade</item>
        <item>Lagoa da Conceição</item>
        <item>Campeche</item>
        <item>Jurerê Internacional</item>
        <item>Santo Antônio de Lisboa</item>
        <item>Saco Grande</item>
        <item>Coqueiros</item>
        <item>Ingleses</item>
    </string-array>
</resources>
```
5. Certifique-se de registrar as novas Activities e adicionar permissão de internet no seu `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />

<activity android:name=".activity.MainActivity" android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
<activity android:name=".activity.SugerirEventoActivity" />
<activity android:name=".activity.EventoDetalheActivity" />
```
