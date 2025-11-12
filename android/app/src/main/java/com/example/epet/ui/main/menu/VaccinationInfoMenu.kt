import android.app.Dialog
import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.content.DialogInterface
import android.graphics.Color
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.example.epet.R
import android.widget.TextView
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import androidx.recyclerview.widget.RecyclerView
import com.example.epet.ui.main.adapter.VaccinationInfoAdapter
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.epet.data.model.passport.OutputVaccinationItem
import com.example.epet.ui.main.viewmodel.PassportViewModel
import kotlinx.coroutines.launch

class VaccinationInfoMenu(private val onClose: (() -> Unit)? = null) : BottomSheetDialogFragment() {

    private val viewModel: PassportViewModel by lazy { PassportViewModel() }

    private lateinit var tv_passport_number: TextView
    private lateinit var tv_update_datetime: TextView
    private lateinit var rv_vaccinations: RecyclerView

    private var pet_id: String? = null

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

        initArguments()
        initViews(view)
        initButtons()
        initStateFlow()
    }

    override fun onDismiss(dialog: DialogInterface) {
        super.onDismiss(dialog)
        onClose?.invoke()
    }

    /** Приймання аргіментів **/
    private fun initArguments() {
        pet_id = arguments?.getString("pet_id")
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        tv_passport_number = view.findViewById(R.id.tv_passport_number)
        tv_update_datetime = view.findViewById(R.id.tv_update_datetime)
        rv_vaccinations = view.findViewById(R.id.rv_vaccinations)
    }

    /** Ініціалізація кнопок **/
    private fun initButtons() {
    }

    /** Ініціалізація StateFlow **/
    private fun initStateFlow() {
        val sharedPref = requireContext().getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
        val token = sharedPref.getString("access_token", null)
        viewModel.vaccinationList(token, pet_id)

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.outputVaccinationList.collect { state ->
                    tv_passport_number.text = state.passport_number

                    val repeatedText = "Паспорт оновлено ${state.update_datetime} "
                    tv_update_datetime.text = repeatedText.repeat(100)
                    tv_update_datetime.isSelected = true

                    setupRecyclerView(state.vaccinations)
                }
            }
        }
    }

    /** Налаштування RecyclerView **/
    private fun setupRecyclerView(outputVaccinations: List<OutputVaccinationItem>) {
        val adapter = VaccinationInfoAdapter(outputVaccinations)
        rv_vaccinations.layoutManager = LinearLayoutManager(requireContext())
        rv_vaccinations.adapter = adapter
    }
}
