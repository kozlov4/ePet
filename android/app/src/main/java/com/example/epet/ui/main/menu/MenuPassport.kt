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

class MenuPassport(private val onClose: (() -> Unit)? = null) : BottomSheetDialogFragment() {

    private lateinit var tv_passport_info: TextView
    private lateinit var tv_vaccination_info: TextView
    private lateinit var tv_documents: TextView
    private lateinit var tv_question: TextView
    private lateinit var tv_close: TextView

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
        return inflater.inflate(R.layout.menu_passport, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
    }

    override fun onDismiss(dialog: DialogInterface) {
        super.onDismiss(dialog)
        onClose?.invoke()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        tv_passport_info = view.findViewById(R.id.tv_passport_info)
        tv_vaccination_info = view.findViewById(R.id.tv_vaccination_info)
        tv_documents = view.findViewById(R.id.tv_documents)
        tv_question = view.findViewById(R.id.tv_question)
        tv_close = view.findViewById(R.id.tv_close)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {

        tv_passport_info.setOnClickListener {
            dismiss()
            MenuPassportInfo().show(parentFragmentManager, "MenuPassportInfo")
        }

        tv_vaccination_info.setOnClickListener {
            dismiss()
            MenuVaccinationInfo().show(parentFragmentManager, "MenuVaccinationInfo")
        }

        tv_close.setOnClickListener {
            dismiss()
        }
    }
}
