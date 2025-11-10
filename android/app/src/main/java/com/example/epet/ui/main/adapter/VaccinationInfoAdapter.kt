package com.example.epet.ui.main.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.R
import com.example.epet.data.model.OutputVaccination

class VaccinationInfoAdapter(private val outputVaccinations: List<OutputVaccination>) : RecyclerView.Adapter<VaccinationInfoAdapter.VaccinationViewHolder>() {

    class VaccinationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tv_name: TextView = itemView.findViewById(R.id.tv_pet_name)
        val tv_date_start: TextView = itemView.findViewById(R.id.tv_date_start)
        val tv_date_end: TextView = itemView.findViewById(R.id.tv_date_end)
        val tv_serial_number: TextView = itemView.findViewById(R.id.tv_serial_number)
        val tv_vet: TextView = itemView.findViewById(R.id.tv_vet)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VaccinationViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_vaccination, parent, false)
        return VaccinationViewHolder(view)
    }

    override fun onBindViewHolder(holder: VaccinationViewHolder, position: Int) {
        val vaccination = outputVaccinations[position]
        holder.tv_name.text = vaccination.name
        holder.tv_date_start.text = vaccination.dateStart
        holder.tv_date_end.text = "до ${vaccination.dateEnd}"
        holder.tv_serial_number.text = vaccination.serialNumber
        holder.tv_vet.text = vaccination.vet
    }

    override fun getItemCount(): Int = outputVaccinations.size
}
