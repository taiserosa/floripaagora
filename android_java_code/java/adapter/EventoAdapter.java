package com.floripa.agora.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.floripa.agora.R;
import com.floripa.agora.model.EventoModel;
import java.util.List;

/**
 * Adapter para gerenciar a renderização de itens de evento no RecyclerView.
 */
public class EventoAdapter extends RecyclerView.Adapter<EventoAdapter.EventoViewHolder> {

    private List<EventoModel> eventos;
    private final OnEventoClickListener listener;

    public interface OnEventoClickListener {
        void onEventoClick(EventoModel evento);
    }

    public EventoAdapter(List<EventoModel> eventos, OnEventoClickListener listener) {
        this.eventos = eventos;
        this.listener = listener;
    }

    public void setEventos(List<EventoModel> novosEventos) {
        this.eventos = novosEventos;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public EventoViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_evento, parent, false);
        return new EventoViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EventoViewHolder holder, int position) {
        EventoModel evento = eventos.get(position);
        holder.bind(evento, listener);
    }

    @Override
    public int getItemCount() {
        return eventos != null ? eventos.size() : 0;
    }

    static class EventoViewHolder extends RecyclerView.ViewHolder {
        private final TextView tvChecksIcon;
        private final TextView tvEventTitle;
        private final TextView tvEventDetails;
        private final TextView tvEventPriceTag;
        private final TextView tvComunidadeTag;

        public EventoViewHolder(@NonNull View itemView) {
            super(itemView);
            tvChecksIcon = itemView.findViewById(R.id.tvChecksIcon);
            tvEventTitle = itemView.findViewById(R.id.tvEventTitle);
            tvEventDetails = itemView.findViewById(R.id.tvEventDetails);
            tvEventPriceTag = itemView.findViewById(R.id.tvEventPriceTag);
            tvComunidadeTag = itemView.findViewById(R.id.tvComunidadeTag);
        }

        public void bind(final EventoModel evento, final OnEventoClickListener clickListener) {
            // Configura título principal destacado
            tvEventTitle.setText(evento.getTitle());

            // Formatação de data amigável (Ex: dd/MM/yyyy)
            String formattedDate = reformatDate(evento.getDate());
            String details = " - " + formattedDate + " às " + evento.getTime() + "h\nLocal: " + evento.getLocationName() + " (" + evento.getNeighborhood() + ")";
            tvEventDetails.setText(details);

            // Price/Tarifário Tag
            tvEventPriceTag.setText(evento.getPrice());
            boolean isFree = evento.getPrice().toLowerCase().contains("gratuito") ||
                    evento.getPrice().toLowerCase().contains("grátis") ||
                    evento.getPrice().toLowerCase().contains("franca") ||
                    evento.getPrice().toLowerCase().contains("abert");

            if (isFree) {
                tvEventPriceTag.setBackgroundResource(R.drawable.bg_pill_free);
                tvEventPriceTag.setTextColor(itemView.getResources().getColor(android.R.color.holo_green_dark));
            } else {
                tvEventPriceTag.setBackgroundResource(R.drawable.bg_pill_paid);
                tvEventPriceTag.setTextColor(itemView.getResources().getColor(android.R.color.holo_orange_dark));
            }

            // Exclui ou exibe tag "Sugerido por usuário" se comunidade = true
            if (evento.isComunidade()) {
                tvComunidadeTag.setVisibility(View.VISIBLE);
                tvComunidadeTag.setText("👥 Sugerido por usuário");
            } else {
                tvComunidadeTag.setVisibility(View.GONE);
            }

            // Click listener
            itemView.setOnClickListener(v -> {
                if (clickListener != null) {
                    clickListener.onEventoClick(evento);
                }
            });
        }

        // Helper simples para inverter YYYY-MM-DD para DD/MM/YYYY
        private String reformatDate(String isoDate) {
            if (isoDate == null || !isoDate.contains("-")) return "dd/mm/aaaa";
            String[] parts = isoDate.split("-");
            if (parts.length == 3) {
                return parts[2] + "/" + parts[1] + "/" + parts[0];
            }
            return isoDate;
        }
    }
}
