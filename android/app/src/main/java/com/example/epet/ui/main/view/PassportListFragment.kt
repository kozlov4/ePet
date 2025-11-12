package com.example.epet.ui.main.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.LinearSnapHelper
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.R
import com.example.epet.ui.main.adapter.PassportListAdapter
import kotlin.math.abs
import SelectorMenu
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.example.epet.ui.main.viewmodel.PassportViewModel
import kotlinx.coroutines.launch
import com.example.epet.data.model.passport.OutputPetItem
import kotlin.getValue
import androidx.fragment.app.activityViewModels

class PassportListFragment : Fragment() {

    private val viewModel: PassportViewModel by activityViewModels()

    private lateinit var rvPassports: RecyclerView
    private lateinit var llIndicators: LinearLayout

    private lateinit var layoutManager: LinearLayoutManager
    private lateinit var passportListAdapter: PassportListAdapter
    private lateinit var snapHelper: LinearSnapHelper

    private val CARD_SCALE_MAX = 1.0f
    private val CARD_SCALE_MIN = 0.88f
    private val CARD_WIDTH_RATIO = 0.83f
    private val INDICATOR_SIZE_DP = 8
    private val INDICATOR_MARGIN_DP = 5
    private val INDICATOR_ALPHA_MIN = 0.3f

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_passport_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initViews(view)
        initStateFlow()
        setupSnapHelper()
        centerFirstCard()
        setupScrollListener()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        rvPassports = view.findViewById(R.id.rv_passports)
        llIndicators = view.findViewById(R.id.ll_indicators)
    }

    /** Ініціалізація StateFlow **/
    private fun initStateFlow() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.outputPassportList.collect { state ->
                    setupRecyclerView(state)
                    setupIndicators(state.size)
                }
            }
        }
    }

    /** Налаштування RecyclerView **/
    private fun setupRecyclerView(passports: List<OutputPetItem>) {
        passportListAdapter = PassportListAdapter(passports) { pet_id ->
            val menu = SelectorMenu()
            val bundle = Bundle().apply {
                putString("pet_id", pet_id)
            }
            menu.arguments = bundle
            menu.show(parentFragmentManager, "SelectorMenu")
        }

        layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
        rvPassports.layoutManager = layoutManager
        rvPassports.adapter = passportListAdapter
    }

    /** Налаштування SnapHelper для центрованої прокрутки **/
    private fun setupSnapHelper() {
        snapHelper = object : LinearSnapHelper() {
            override fun findTargetSnapPosition(layoutManager: RecyclerView.LayoutManager, velocityX: Int, velocityY: Int): Int {
                val currentView = findSnapView(layoutManager) ?: return RecyclerView.NO_POSITION
                val currentPos = layoutManager.getPosition(currentView)
                return when {
                    velocityX > 0 -> (currentPos + 1).coerceAtMost(passportListAdapter.itemCount - 1)
                    velocityX < 0 -> (currentPos - 1).coerceAtLeast(0)
                    else -> currentPos
                }
            }
        }
        snapHelper.attachToRecyclerView(rvPassports)
    }

    /** Центрування першої карточки та налаштування padding **/
    private fun centerFirstCard() {
        rvPassports.post {
            val screenWidth = resources.displayMetrics.widthPixels
            val cardWidth = (screenWidth * CARD_WIDTH_RATIO).toInt()
            val sidePadding = (screenWidth - cardWidth) / 2

            rvPassports.setPadding(sidePadding, 0, sidePadding, 0)
            rvPassports.clipToPadding = false
            rvPassports.overScrollMode = RecyclerView.OVER_SCROLL_NEVER
            layoutManager.scrollToPositionWithOffset(0, sidePadding)
            rvPassports.post { scaleChildren() }
        }
    }

    /** Слушатель прокрутки для масштабування карток **/
    private fun setupScrollListener() {
        rvPassports.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                scaleChildren()
            }
        })
    }

    /** Масштабування карток та плавне оновлення індикаторів **/
    private fun scaleChildren() {
        val center = rvPassports.width / 2
        val childCount = rvPassports.childCount
        val indicatorCount = llIndicators.childCount

        for (i in 0 until indicatorCount) llIndicators.getChildAt(i).alpha = INDICATOR_ALPHA_MIN

        for (i in 0 until childCount) {
            val child = rvPassports.getChildAt(i)
            val childCenter = (child.left + child.right) / 2
            val distance = abs(center - childCenter)

            val scale = CARD_SCALE_MAX - (distance.toFloat() / rvPassports.width) * (CARD_SCALE_MAX - CARD_SCALE_MIN)
            child.scaleX = scale
            child.scaleY = scale

            val position = layoutManager.getPosition(child)
            if (position in 0 until indicatorCount) {
                val alpha = 1f - (distance.toFloat() / rvPassports.width)
                llIndicators.getChildAt(position).alpha = alpha.coerceIn(INDICATOR_ALPHA_MIN, 1f)
            }
        }
    }

    /** Створення індикаторів під RecyclerView **/
    private fun setupIndicators(count: Int) {
        llIndicators.removeAllViews()
        val sizePx = (resources.displayMetrics.density * INDICATOR_SIZE_DP).toInt()
        val marginPx = (resources.displayMetrics.density * INDICATOR_MARGIN_DP).toInt()

        repeat(count) {
            val dot = View(requireContext()).apply {
                layoutParams = LinearLayout.LayoutParams(sizePx, sizePx).apply { setMargins(marginPx, 0, marginPx, 0) }
                setBackgroundResource(R.drawable.icon_indicator)
                alpha = INDICATOR_ALPHA_MIN
            }
            llIndicators.addView(dot)
        }
    }
}
