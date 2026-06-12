package com.floripa.agora.model;

import java.io.Serializable;

/**
 * Modelo de dados para os Eventos Culturais da Agenda "Floripa Agora".
 * Implementa Serializable para permitir o envio facilitado entre Activities via Intent.
 */
public class EventoModel implements Serializable {
    private String id;
    private String title;
    private String description;
    private String category; // 'feiras', 'shows', 'esportes', 'cursos', 'outros'
    private String subCategory;
    private String date; // YYYY-MM-DD
    private String time; // HH:MM
    private String locationName;
    private String neighborhood;
    private String address;
    private double latitude;
    private double longitude;
    private String price; // Ex: "Gratuito" ou "R$ 40,00"
    private String imageUrl;
    private boolean featured;
    private boolean comunidade; // Se true, foi cadastrado localmente pelo usuário

    // Construtor vazio para desserialização
    public EventoModel() {}

    // Construtor completo
    public EventoModel(String id, String title, String description, String category, String subCategory,
                       String date, String time, String locationName, String neighborhood, String address,
                       double latitude, double longitude, String price, String imageUrl, boolean featured, boolean comunidade) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.subCategory = subCategory;
        this.date = date;
        this.time = time;
        this.locationName = locationName;
        this.neighborhood = neighborhood;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.price = price;
        this.imageUrl = imageUrl;
        this.featured = featured;
        this.comunidade = comunidade;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public String getNeighborhood() { return neighborhood; }
    public void setNeighborhood(String neighborhood) { this.neighborhood = neighborhood; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public boolean isComunidade() { return comunidade; }
    public void setComunidade(boolean comunidade) { this.comunidade = comunidade; }
}
