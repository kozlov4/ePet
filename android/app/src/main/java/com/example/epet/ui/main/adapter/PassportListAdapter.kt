package com.example.epet.ui.main.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.cardview.widget.CardView
import android.widget.ImageView
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.R
import com.example.epet.data.model.passport.OutputPetItem

class PassportListAdapter(
    private val passportList: List<OutputPetItem>,
    private val onMenuClick: (pet_id: String) -> Unit) : RecyclerView.Adapter<PassportListAdapter.PassportViewHolder>() {

    inner class PassportViewHolder(val card: CardView) : RecyclerView.ViewHolder(card) {
        val tv_pet_name_ua: TextView = card.findViewById(R.id.tv_drug_name)
        val tv_pet_name_en: TextView = card.findViewById(R.id.tv_pet_name_en)
        val tv_date_of_birth: TextView = card.findViewById(R.id.tv_date_of_birth)
        val tv_passport_number: TextView = card.findViewById(R.id.tv_passport_number)
        val tv_update_datetime: TextView = card.findViewById(R.id.tv_update_datetime)
        val iv_menu: ImageView = card.findViewById(R.id.iv_menu)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PassportViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_passport, parent, false) as CardView

        val screenWidth = parent.context.resources.displayMetrics.widthPixels
        view.layoutParams.width = (screenWidth * 0.83).toInt()
        return PassportViewHolder(view)
    }

    override fun onBindViewHolder(holder: PassportViewHolder, position: Int) {
        val passport = passportList[position]
        holder.tv_pet_name_ua.text = passport.pet_name_ua
        holder.tv_pet_name_en.text = passport.pet_name_en
        holder.tv_date_of_birth.text = passport.date_of_birth
        holder.tv_passport_number.text = passport.passport_number

        val repeatedText = "Паспорт оновлено ${passport.update_datetime} "
        holder.tv_update_datetime.text = repeatedText.repeat(100)
        holder.tv_update_datetime.isSelected = true

        holder.iv_menu.setOnClickListener {
            onMenuClick(passport.pet_id)
        }
    }

    override fun getItemCount(): Int = passportList.size
}
