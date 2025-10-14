import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.content.DialogInterface
import android.graphics.Color
import androidx.core.widget.NestedScrollView
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.example.epet.R
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.data.model.OutputVaccination
import com.example.epet.ui.main.adapter.VaccinationInfoAdapter
import androidx.recyclerview.widget.LinearLayoutManager

class VaccinationInfoMenu(private val onClose: (() -> Unit)? = null) : BottomSheetDialogFragment() {

    private lateinit var sv_main: NestedScrollView
    private lateinit var tv_last_update: TextView
    private lateinit var rv_vaccinations: RecyclerView

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        return BottomSheetDialog(requireContext(), R.style.MenuPassportAnimation).apply {
            setOnShowListener { dialogInterface ->
                val bottomSheetDialog = dialogInterface as BottomSheetDialog
                val bottomSheet = bottomSheetDialog.findViewById<View>(com.google.android.material.R.id.design_bottom_sheet)
                val behavior = BottomSheetBehavior.from(bottomSheet!!)
                val layoutParams = bottomSheet.layoutParams

                layoutParams.height = ViewGroup.LayoutParams.MATCH_PARENT
                bottomSheet.layoutParams = layoutParams
                behavior.state = BottomSheetBehavior.STATE_EXPANDED
                behavior.isDraggable = true
                behavior.skipCollapsed = true
                behavior.isHideable = true
                bottomSheet.setBackgroundColor(Color.TRANSPARENT)

                behavior.addBottomSheetCallback(object : BottomSheetBehavior.BottomSheetCallback() {
                    override fun onStateChanged(bottomSheet: View, newState: Int) {
                        if (newState == BottomSheetBehavior.STATE_HIDDEN) {
                            dismiss()
                        }
                    }

                    override fun onSlide(bottomSheet: View, slideOffset: Float) {}
                })
            }
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.menu_vaccination_info, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
        initInfo()
    }

    override fun onDismiss(dialog: DialogInterface) {
        super.onDismiss(dialog)
        onClose?.invoke()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        sv_main = view.findViewById(R.id.sv_main)
        tv_last_update = view.findViewById(R.id.tv_last_update)
        rv_vaccinations = view.findViewById(R.id.rv_vaccinations)
    }

    /** Ініціалізація кнопок **/
    private fun initButtons() {
    }

    /** Заповнення даних **/
    private fun initInfo() {
        tv_last_update.text = getLastUpdateText()
        tv_last_update.isSelected = true

        setupRecyclerView(getSampleVaccinations())
    }

    /** Повертає приклад тексту останнього оновлення **/
    private fun getLastUpdateText(): String {
        val repeatedText = "Паспорт оновлено 01.10.2025 "
        return repeatedText.repeat(100)
    }

    /** Повертає приклад даних про вакцинації **/
    private fun getSampleVaccinations(): List<OutputVaccination> = listOf(
        OutputVaccination("Nobivac Rabies", "04.09.2024", "04.09.2025", "A452A01", "ЕкоЦентр"),
        OutputVaccination("Nobivac DHPPi/L", "10.05.2023", "10.05.2024", "B123C45", "ЕкоЦентр"),
        OutputVaccination("Nobivac Rabies", "04.09.2024", "04.09.2025", "A452A01", "ЕкоЦентр"),
        OutputVaccination("Nobivac DHPPi/L", "10.05.2023", "10.05.2024", "B123C45", "ЕкоЦентр"),
        OutputVaccination("Nobivac Lepto", "15.06.2025", "15.06.2026", "C987D65", "ЕкоЦентр")
    )

    /** Налаштування RecyclerView **/
    private fun setupRecyclerView(outputVaccinations: List<OutputVaccination>) {
        val adapter = VaccinationInfoAdapter(outputVaccinations)
        rv_vaccinations.layoutManager = LinearLayoutManager(requireContext())
        rv_vaccinations.adapter = adapter
    }
}
