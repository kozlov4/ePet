import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.content.DialogInterface
import android.widget.TextView
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.example.epet.R
import android.content.Context
import androidx.fragment.app.activityViewModels
import com.example.epet.ui.main.viewmodel.PassportViewModel

class SelectorMenu(private val onClose: (() -> Unit)? = null) : BottomSheetDialogFragment() {

    private val passportViewModel: PassportViewModel by activityViewModels()

    private lateinit var tv_passport_info: TextView
    private lateinit var tv_vaccination_info: TextView
    private lateinit var tv_close: TextView

    private var pet_id: String? = null

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        return BottomSheetDialog(requireContext(), R.style.MenuPassportAnimation).apply {
            setOnShowListener { dialogInterface ->
                val bottomSheetDialog = dialogInterface as BottomSheetDialog
                val bottomSheet = bottomSheetDialog.findViewById<View>(com.google.android.material.R.id.design_bottom_sheet)
                val behavior = BottomSheetBehavior.from(bottomSheet!!)

                bottomSheet.setBackgroundColor(android.graphics.Color.TRANSPARENT)
                behavior.state = BottomSheetBehavior.STATE_EXPANDED
                behavior.isDraggable = false
            }
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.menu_selector, container, false)
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
        tv_passport_info = view.findViewById(R.id.tv_passport_info)
        tv_vaccination_info = view.findViewById(R.id.tv_vaccination_info)
        tv_close = view.findViewById(R.id.tv_close)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {

        tv_passport_info.setOnClickListener {
            dismiss()
            val menu = PassportInfoMenu()
            val bundle = Bundle().apply {
                putString("pet_id", pet_id)
            }
            menu.arguments = bundle
            menu.show(parentFragmentManager, "PassportInfoMenu")
        }

        tv_vaccination_info.setOnClickListener {
            dismiss()
            val menu = VaccinationInfoMenu()
            val bundle = Bundle().apply {
                putString("pet_id", pet_id)
            }
            menu.arguments = bundle
            menu.show(parentFragmentManager, "VaccinationInfoMenu")
        }

        tv_close.setOnClickListener {
            dismiss()
        }
    }

    /** Ініціалізація StateFlow **/
    private fun initStateFlow() {
        val sharedPref = requireContext().getSharedPreferences("UserPrefs", Context.MODE_PRIVATE)
        val token = sharedPref.getString("access_token", null)
        passportViewModel.getPassportDetail(token, pet_id)
        passportViewModel.getVaccinationsList(token, pet_id)
    }
}
