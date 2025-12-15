package com.example.epet.ui.services.view

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.widget.AppCompatButton
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.navigation.fragment.findNavController
import com.example.epet.R
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.LinearSnapHelper
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.data.model.notification.OutputNotification
import com.example.epet.data.model.passport.OutputPetItem
import com.example.epet.data.model.service.InputExtractPet
import com.example.epet.ui.main.view.MainActivity
import com.example.epet.ui.main.viewmodel.PassportViewModel
import com.example.epet.ui.service.adapter.PetListAdapter
import com.example.epet.ui.service.viewmodel.ServiceViewModel
import kotlinx.coroutines.launch
import kotlin.getValue
import kotlin.math.abs
import com.example.epet.ui.main.viewmodel.LoadingViewModel

class ExtractPetFragment : Fragment() {

    private val loadingViewModel: LoadingViewModel by activityViewModels()
    private val passportViewModel: PassportViewModel by activityViewModels()
    private val serviceViewModel: ServiceViewModel by activityViewModels()

    private val args: ExtractPetFragmentArgs by navArgs()

    private lateinit var layoutManager: LinearLayoutManager
    private lateinit var snapHelper: LinearSnapHelper
    private lateinit var petListAdapter: PetListAdapter

    private lateinit var iv_to_back: ImageView
    private lateinit var tv_tittletext: TextView
    private lateinit var tv_description: TextView
    private lateinit var tv_message: TextView
    private lateinit var rv_pets: RecyclerView
    private lateinit var bth_create_extract: AppCompatButton

    private val CARD_SCALE_MAX = 1.0f
    private val CARD_SCALE_MIN = 0.7f
    private val CARD_WIDTH_RATIO = 0.6f

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_extract_pet, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initExtractInfo()
        initButtons()
        initStateFlow()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        tv_tittletext = view.findViewById(R.id.tv_tittletext)
        tv_description = view.findViewById(R.id.tv_description)
        tv_message = view.findViewById(R.id.tv_message)
        rv_pets = view.findViewById(R.id.rv_pets)
        bth_create_extract = view.findViewById(R.id.bth_create_extract)
    }

    /** Ініціалізація даних витяга **/
    private fun initExtractInfo() {
        val extractName = args.extractName

        if (extractName == "Витяг з реєстру домашніх тварин") {
            tv_description.setText("• Ім’я тварини\n• Вид\n• Порода\n• Стать\n• Дата народження\n• Колір\n• Фото\n• Інформація про ЦНАП, який видав\n   паспорт\n• Інформація про власника")
        } else if (extractName == "Витяг про щеплення тварини") {
            tv_description.text = "• Список проведених щеплень\n• Виробник препарату\n• Назва препарату\n• Серія препарату\n• Дата вакцинації\n• Термін дії вакцинації\n• Назва організації, яка проводила\n   щеплення"
        } else if (extractName == "Витяг за ідентифікаторами") {
            tv_description.text = "• Тип ідентифікатора\n• Номер ідентифікатора\n• Дата встановлення ідентифікатора\n• Дані тварини\n• Інформація про ЦНАП, що встановив\n   ідентифікатор"
        }
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_to_back.setOnClickListener {
            findNavController().popBackStack()
        }

        bth_create_extract.setOnClickListener {
            val sharedPref = requireContext().getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
            val token = sharedPref.getString("access_token", null)
            val extractName = args.extractName
            var inputExtractName = ""
            val selectedPetId = getCenteredPetId()

            if (extractName == "Витяг з реєстру домашніх тварин") {
                inputExtractName = "Витяг з реєстру домашніх тварин"
            } else if (extractName == "Витяг про щеплення тварини") {
                inputExtractName = "Медичний витяг про проведені щеплення тварини"
            } else if (extractName == "Витяг за ідентифікаторами") {
                inputExtractName = "Офіційний витяг про ідентифікаційні дані тварини"
            }

            serviceViewModel.generateReport(token, InputExtractPet(selectedPetId, inputExtractName))
            loadingViewModel.show()
        }
    }

    /** Ініціалізація StateFlow **/
    private fun initStateFlow() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {

                launch {
                    passportViewModel.outputPassportList.collect { state ->
                        if (state == emptyList<OutputPetItem>())  {
                            tv_message.visibility = View.VISIBLE
                            bth_create_extract.isEnabled = false
                            bth_create_extract.alpha = 0.5f
                        } else {
                            tv_message.visibility = View.INVISIBLE
                            bth_create_extract.isEnabled = true
                            bth_create_extract.alpha = 1.0f
                            setupRecyclerView(state)
                        }
                    }
                }

                launch {
                    serviceViewModel.outputGenerateReport.collect { state ->
                        if (state.detail == "Витяг створено успішно та надіслано на вашу пошту") {
                            navigateToMessage("✅", "Витяг сформовано!", state.detail)
                        } else {
                            navigateToMessage("⛔", "Помилка!", state.detail)
                        }

                        loadingViewModel.hide()
                    }
                }
            }
        }
    }

    /** Перехід на сторінку повідомлення **/
    private fun navigateToMessage(emoji: String, main: String, description: String) {
        val action = ExtractPetFragmentDirections.actionExtractPetToMessage(
            tittletext = "Витяг про улюбленця",
            emoji = emoji,
            main = main,
            description = description
        )
        findNavController().navigate(action)
    }

    /** Налаштування RecyclerView **/
    private fun setupRecyclerView(passports: List<OutputPetItem>) {
        petListAdapter = PetListAdapter(passports)
        layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)

        rv_pets.layoutManager = layoutManager
        rv_pets.adapter = petListAdapter

        setupSnapHelper()
        centerFirstCard()
        setupScrollListener()
    }

    /** Налаштування SnapHelper для центрованої прокрутки **/
    private fun setupSnapHelper() {
        snapHelper = object : LinearSnapHelper() {
            override fun findTargetSnapPosition(layoutManager: RecyclerView.LayoutManager, velocityX: Int, velocityY: Int): Int {
                val currentView = findSnapView(layoutManager) ?: return RecyclerView.NO_POSITION
                val currentPos = layoutManager.getPosition(currentView)
                return when {
                    velocityX > 0 -> (currentPos + 1).coerceAtMost(petListAdapter.itemCount - 1)
                    velocityX < 0 -> (currentPos - 1).coerceAtLeast(0)
                    else -> currentPos
                }
            }
        }
        snapHelper.attachToRecyclerView(rv_pets)
    }

    /** Центрування першої карточки та налаштування padding **/
    private fun centerFirstCard() {
        rv_pets.post {
            val screenWidth = resources.displayMetrics.widthPixels
            val cardWidth = (screenWidth * CARD_WIDTH_RATIO).toInt()
            val sidePadding = (screenWidth - cardWidth) / 2

            rv_pets.setPadding(sidePadding, 0, sidePadding, 0)
            rv_pets.clipToPadding = false
            rv_pets.overScrollMode = RecyclerView.OVER_SCROLL_NEVER
            layoutManager.scrollToPositionWithOffset(0, sidePadding)
            rv_pets.post { scaleChildren() }
        }
    }

    /** Слушатель прокрутки для масштабування карток **/
    private fun setupScrollListener() {
        rv_pets.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                scaleChildren()
            }
        })
    }

    /** Масштабування карток **/
    private fun scaleChildren() {
        val center = rv_pets.width / 4
        val childCount = rv_pets.childCount

        for (i in 0 until childCount) {
            val child = rv_pets.getChildAt(i)
            val childCenter = (child.left + child.right) / 4
            val distance = abs(center - childCenter)

            val scale = CARD_SCALE_MAX - (distance.toFloat() / rv_pets.width) * (CARD_SCALE_MAX - CARD_SCALE_MIN)
            child.scaleX = scale
            child.scaleY = scale
        }
    }

    /** Знаходження pet_id **/
    private fun getCenteredPetId(): String? {
        val center = rv_pets.width / 2
        var closestChild: View? = null
        var minDistance = Int.MAX_VALUE

        for (i in 0 until rv_pets.childCount) {
            val child = rv_pets.getChildAt(i)
            val childCenter = (child.left + child.right) / 2
            val distance = abs(center - childCenter)

            if (distance < minDistance) {
                minDistance = distance
                closestChild = child
            }
        }

        closestChild ?: return null

        val position = rv_pets.getChildAdapterPosition(closestChild)
        if (position == RecyclerView.NO_POSITION) return null

        return petListAdapter.getItem(position).pet_id
    }
}