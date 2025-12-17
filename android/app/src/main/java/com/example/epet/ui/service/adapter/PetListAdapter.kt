package com.example.epet.ui.service.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.TextView
import androidx.cardview.widget.CardView
import android.widget.ImageView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.epet.R
import com.example.epet.data.model.passport.OutputPetItem

class PetListAdapter( private var passportList: List<OutputPetItem>) : RecyclerView.Adapter<PetListAdapter.PetListViewHolder>() {

    inner class PetListViewHolder(val card: CardView) : RecyclerView.ViewHolder(card) {
        val tv_pet_name_ua: TextView = card.findViewById(R.id.tv_pet_name)
        val tv_pet_name_en: TextView = card.findViewById(R.id.tv_pet_name_en)
        val iv_photo: ImageView = card.findViewById(R.id.iv_photo)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PetListViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_extract_pet, parent, false) as CardView

        val screenWidth = parent.context.resources.displayMetrics.widthPixels
        view.layoutParams.width = (screenWidth * 0.6).toInt()
        return PetListViewHolder(view)
    }

    override fun onBindViewHolder(holder: PetListViewHolder, position: Int) {
        val passport = passportList[position]
        holder.tv_pet_name_ua.text = passport.pet_name_ua
        holder.tv_pet_name_en.text = passport.pet_name_en

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
    }

    fun getItem(position: Int): OutputPetItem {
        return passportList[position]
    }

    fun updateData(newList: List<OutputPetItem>) {
        this.passportList = newList
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int = passportList.size
}
