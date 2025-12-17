package com.example.epet.ui.main.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.epet.R
import com.example.epet.data.model.passport.OutputPetItem

class PassportListAdapter(
    private var passportsList: List<OutputPetItem>,
    private val onMenuClick: (pet_id: String) -> Unit) : RecyclerView.Adapter<PassportListAdapter.PassportViewHolder>() {

    inner class PassportViewHolder(val card: CardView) : RecyclerView.ViewHolder(card) {
        val tv_pet_name_ua: TextView = card.findViewById(R.id.tv_pet_name)
        val tv_pet_name_en: TextView = card.findViewById(R.id.tv_pet_name_en)
        val tv_date_of_birth: TextView = card.findViewById(R.id.tv_date_of_birth)
        val tv_passport_number: TextView = card.findViewById(R.id.tv_passport_number)
        val tv_update_datetime: TextView = card.findViewById(R.id.tv_update_datetime)
        val iv_photo: ImageView = card.findViewById(R.id.iv_photo)
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
        val passport = passportsList[position]
        holder.tv_pet_name_ua.text = passport.pet_name_ua
        holder.tv_pet_name_en.text = passport.pet_name_en
        holder.tv_date_of_birth.text = passport.date_of_birth
        holder.tv_passport_number.text = passport.passport_number

        val repeatedText = "Паспорт оновлено ${passport.update_datetime} "
        holder.tv_update_datetime.text = repeatedText.repeat(100)
        holder.tv_update_datetime.isSelected = true

        val img_url: String = passport.img_url
        try {
            if (img_url.isNotBlank() && img_url != "https://") {
                Glide.with(holder.itemView.context)
                    .load(img_url)
                    .error(R.drawable.icon_empty_image)
                    .into(holder.iv_photo)
            } else {
                holder.iv_photo.setImageResource(R.drawable.icon_empty_image)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            holder.iv_photo.setImageResource(R.drawable.icon_empty_image)
        }

        holder.iv_menu.setOnClickListener {
            onMenuClick(passport.pet_id)
        }
    }

    fun updateData(newList: List<OutputPetItem>) {
        this.passportsList = newList
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int = passportsList.size
}
