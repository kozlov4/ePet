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
import android.widget.ImageView

class PassportInfoMenu(private val onClose: (() -> Unit)? = null) : BottomSheetDialogFragment() {

    private lateinit var sv_main: NestedScrollView
    private lateinit var tv_passport_number: TextView
    private lateinit var iv_copy_passport: ImageView
    private lateinit var tv_last_update: TextView
    private lateinit var tv_name_ua: TextView
    private lateinit var tv_name_en: TextView
    private lateinit var iv_photo: ImageView
    private lateinit var tv_birth_date: TextView
    private lateinit var tv_breed_ua: TextView
    private lateinit var tv_breed_en: TextView
    private lateinit var tv_sex_ua: TextView
    private lateinit var tv_sex_en: TextView
    private lateinit var tv_color_ua: TextView
    private lateinit var tv_color_en: TextView
    private lateinit var tv_species_ua: TextView
    private lateinit var tv_species_en: TextView
    private lateinit var tv_owner_passport_number: TextView
    private lateinit var tv_autority_number: TextView
    private lateinit var tv_chip_location_ua: TextView
    private lateinit var tv_chip_location_en: TextView
    private lateinit var tv_chip_date: TextView
    private lateinit var tv_chip_number: TextView

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
        return inflater.inflate(R.layout.menu_passport_info, container, false)
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
        tv_passport_number = view.findViewById(R.id.tv_passport_number)
        iv_copy_passport = view.findViewById(R.id.iv_copy_passport)
        tv_last_update = view.findViewById(R.id.tv_last_update)
        tv_name_ua = view.findViewById(R.id.tv_name_ua)
        tv_name_en = view.findViewById(R.id.tv_name_en)
        iv_photo = view.findViewById(R.id.iv_photo)
        tv_birth_date = view.findViewById(R.id.tv_birth_date)
        tv_breed_ua = view.findViewById(R.id.tv_breed_ua)
        tv_breed_en = view.findViewById(R.id.tv_breed_en)
        tv_sex_ua = view.findViewById(R.id.tv_sex_ua)
        tv_sex_en = view.findViewById(R.id.tv_sex_en)
        tv_color_ua = view.findViewById(R.id.tv_color_ua)
        tv_color_en = view.findViewById(R.id.tv_color_en)
        tv_species_ua = view.findViewById(R.id.tv_species_ua)
        tv_species_en = view.findViewById(R.id.tv_species_en)
        tv_owner_passport_number = view.findViewById(R.id.tv_owner_passport_number)
        tv_autority_number = view.findViewById(R.id.tv_autority_number)
        tv_chip_location_ua = view.findViewById(R.id.tv_chip_location_ua)
        tv_chip_location_en = view.findViewById(R.id.tv_chip_location_en)
        tv_chip_date = view.findViewById(R.id.tv_chip_date)
        tv_chip_number = view.findViewById(R.id.tv_chip_number)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
    }

    /** Заповнення даних **/
    private fun initInfo() {
        val repeatedText = "Паспорт оновлено 01.10.2025 "
        tv_last_update.text = repeatedText.repeat(100)
        tv_last_update.isSelected = true
    }
}
