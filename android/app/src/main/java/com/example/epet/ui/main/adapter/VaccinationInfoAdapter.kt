package com.example.epet.ui.main.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.R
import com.example.epet.data.model.passport.OutputVaccinationItem

class VaccinationInfoAdapter(private val outputVaccinations: List<OutputVaccinationItem>) : RecyclerView.Adapter<VaccinationInfoAdapter.VaccinationViewHolder>() {

    class VaccinationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tv_drug_name: TextView = itemView.findViewById(R.id.tv_drug_name)
        val tv_vaccination_date: TextView = itemView.findViewById(R.id.tv_vaccination_date)
        val tv_valid_until: TextView = itemView.findViewById(R.id.tv_valid_until)
        val tv_series_number: TextView = itemView.findViewById(R.id.tv_series_number)
        val tv_organization_name: TextView = itemView.findViewById(R.id.tv_organization_name)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VaccinationViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_vaccination, parent, false)
        return VaccinationViewHolder(view)
    }

    override fun onBindViewHolder(holder: VaccinationViewHolder, position: Int) {
        val vaccination = outputVaccinations[position]
        holder.tv_drug_name.text = vaccination.drug_name
        holder.tv_vaccination_date.text = vaccination.vaccination_date
        holder.tv_valid_until.text = "до ${vaccination.valid_until}"
        holder.tv_series_number.text = vaccination.series_number
        holder.tv_organization_name.text = vaccination.organization_name
    }

    override fun getItemCount(): Int = outputVaccinations.size
}
