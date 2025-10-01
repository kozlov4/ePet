package com.example.epet.ui.main.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.R
import com.example.epet.data.model.Vaccination

class VaccinationAdapter(private val vaccinations: List<Vaccination>) : RecyclerView.Adapter<VaccinationAdapter.VaccinationViewHolder>() {

    class VaccinationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tv_name: TextView = itemView.findViewById(R.id.tv_name)
        val tv_date_start: TextView = itemView.findViewById(R.id.tv_date_start)
        val tv_date_end: TextView = itemView.findViewById(R.id.tv_date_end)
        val tv_serial_number: TextView = itemView.findViewById(R.id.tv_serial_number)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VaccinationViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_vaccination, parent, false)
        return VaccinationViewHolder(view)
    }

    override fun onBindViewHolder(holder: VaccinationViewHolder, position: Int) {
        val vac = vaccinations[position]
        holder.tv_name.text = vac.name
        holder.tv_date_start.text = vac.dateStart
        holder.tv_date_end.text = vac.dateEnd
        holder.tv_serial_number.text = vac.serialNumber
    }

    override fun getItemCount(): Int = vaccinations.size
}
