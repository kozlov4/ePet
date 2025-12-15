package com.example.epet.ui.services.view

import android.content.Context.MODE_PRIVATE
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.navigation.fragment.findNavController
import com.bumptech.glide.Glide
import com.example.epet.R
import com.example.epet.data.model.service.InputRequestShelter
import com.example.epet.data.model.service.OutputPetShelter
import com.example.epet.data.model.service.OutputRequestShelter
import com.example.epet.ui.service.viewmodel.ServiceViewModel
import kotlinx.coroutines.launch

class ShelterFragment : Fragment() {

    private val serviceViewModel : ServiceViewModel by activityViewModels()

    private lateinit var card_container: FrameLayout
    private lateinit var ib_like: ImageButton
    private lateinit var ib_dislike: ImageButton
    private lateinit var iv_to_back: ImageView

    private var listPetsShelter: List<OutputPetShelter> = emptyList()
    private var currentIndex = 0
    private var currentPetId = 0

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_shelter, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initViews(view)
        initButtons()
        initStateFlow()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        card_container = view.findViewById(R.id.card_container)
        ib_like = view.findViewById(R.id.ib_like)
        ib_dislike = view.findViewById(R.id.ib_dislike)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_to_back.setOnClickListener {
            findNavController().popBackStack()
        }

        ib_like.setOnClickListener {
            val sharedPref = requireActivity().getSharedPreferences("UserPrefs", MODE_PRIVATE)
            val token = sharedPref.getString("access_token", null)

            serviceViewModel.requestShelter(token, InputRequestShelter(currentPetId))

            swipeCard(exitToLeft = true)
        }

        ib_dislike.setOnClickListener {
            swipeCard(exitToLeft = false)
        }
    }

    /** Ініціалізація StateFlow **/
    private fun initStateFlow() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {

                launch {
                    serviceViewModel.outputPetsShelter.collect { state ->
                        listPetsShelter = state
                        showNextCard(animated = false, listPetsShelter)
                    }
                }

                launch {
                    serviceViewModel.outputRequestShelter.collect { state ->
                        when (state) {
                            is OutputRequestShelter.Success -> navigateToMessage("✅", "Заявку надіслано!", state.message)
                            is OutputRequestShelter.Error -> navigateToMessage("⛔", "Помилка!", state.detail)
                        }
                    }
                }
            }
        }
    }

    /** Перехід на сторінку повідомлення **/
    private fun navigateToMessage(emoji: String, main: String, description: String) {
        val action = ShelterFragmentDirections.actionShelterToMessage(
            tittletext = "Витяг про улюбленця",
            emoji = emoji,
            main = main,
            description = description
        )
        findNavController().navigate(action)
    }

    /** Показ наступної картки **/
    private fun showNextCard(animated: Boolean = true, listPetsShelter: List<OutputPetShelter>) {
        if (currentIndex >= listPetsShelter.size) return

        val pet = listPetsShelter[currentIndex]
        val cardView = layoutInflater.inflate(R.layout.item_shelter, card_container, false)

        val iv_photo = cardView.findViewById<ImageView>(R.id.iv_photo)
        val tv_pet_name = cardView.findViewById<TextView>(R.id.tv_pet_name)
        val tv_gender = cardView.findViewById<TextView>(R.id.tv_gender)
        val tv_breed = cardView.findViewById<TextView>(R.id.tv_breed)
        val tv_birth_date = cardView.findViewById<TextView>(R.id.tv_breed)

        currentPetId = pet.pet_id

        try {
            if (pet.img_url.isNotBlank() && pet.img_url != "https://") {
                Glide.with(requireContext())
                    .load(pet.img_url)
                    .error(R.drawable.icon_empty_image)
                    .into(iv_photo)
            } else {
                iv_photo.setImageResource(R.drawable.icon_empty_image)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            iv_photo.setImageResource(R.drawable.icon_empty_image)
        }

        tv_pet_name.text = pet.pet_name
        tv_gender.text = "Стать: ${pet.gender}"
        tv_breed.text = "Порода: ${pet.breed}"
        tv_birth_date.text = pet.date_of_birth

        if (animated) {
            cardView.scaleX = 0.9f
            cardView.scaleY = 0.9f
            cardView.alpha = 0f
        }

        card_container.addView(cardView, 0)

        if (animated) {
            cardView.animate()
                .alpha(1f)
                .scaleX(1f)
                .scaleY(1f)
                .setDuration(350)
                .start()
        }
    }

    /** Анімація свайпу картки **/
    private fun swipeCard(exitToLeft: Boolean) {
        if (card_container.childCount == 0) return

        val topCard = card_container.getChildAt(card_container.childCount - 1)
        val direction = if (exitToLeft) -1 else 1

        topCard.animate()
            .translationXBy(direction * 800f)
            .rotationBy(direction * 25f)
            .alpha(0f)
            .setDuration(400)
            .withEndAction {
                card_container.removeView(topCard)
                currentIndex++
                showNextCard(animated = true, listPetsShelter)
            }
            .start()
    }
}
