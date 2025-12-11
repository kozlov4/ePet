import android.app.Dialog
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
import android.widget.ImageView
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.example.epet.ui.main.viewmodel.PassportViewModel
import kotlinx.coroutines.launch
import kotlin.getValue
import androidx.fragment.app.activityViewModels
import com.bumptech.glide.Glide
import android.content.Context

class PassportInfoMenu(private val onClose: (() -> Unit)? = null) : BottomSheetDialogFragment() {

    val passportViewModel: PassportViewModel by activityViewModels()

    private lateinit var tv_passport_number: TextView
    private lateinit var iv_copy_passport: ImageView
    private lateinit var tv_update_datetime: TextView
    private lateinit var tv_pet_name: TextView
    private lateinit var tv_pet_name_en: TextView
    private lateinit var iv_photo: ImageView
    private lateinit var tv_date_of_birth: TextView
    private lateinit var tv_breed: TextView
    private lateinit var tv_breed_en: TextView
    private lateinit var tv_gender: TextView
    private lateinit var tv_gender_en: TextView
    private lateinit var tv_color: TextView
    private lateinit var tv_color_en: TextView
    private lateinit var tv_species: TextView
    private lateinit var tv_species_en: TextView
    private lateinit var tv_owner_passport_number: TextView
    private lateinit var tv_organization_id: TextView
    private lateinit var tv_identifier_type: TextView
    private lateinit var tv_identifier_type_en: TextView
    private lateinit var tv_identifier_date: TextView
    private lateinit var tv_identifier_number: TextView

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
        return inflater.inflate(R.layout.menu_passport_info, container, false)
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
        iv_copy_passport = view.findViewById(R.id.iv_copy_passport)
        tv_update_datetime = view.findViewById(R.id.tv_update_datetime)
        tv_pet_name = view.findViewById(R.id.tv_pet_name)
        tv_pet_name_en = view.findViewById(R.id.tv_pet_name_en)
        iv_photo = view.findViewById(R.id.iv_photo)
        tv_date_of_birth = view.findViewById(R.id.tv_date_of_birth)
        tv_breed = view.findViewById(R.id.tv_breed)
        tv_breed_en = view.findViewById(R.id.tv_breed_en)
        tv_gender = view.findViewById(R.id.tv_gender)
        tv_gender_en = view.findViewById(R.id.tv_gender_en)
        tv_color = view.findViewById(R.id.tv_color)
        tv_color_en = view.findViewById(R.id.tv_color_en)
        tv_species = view.findViewById(R.id.tv_species)
        tv_species_en = view.findViewById(R.id.tv_species_en)
        tv_owner_passport_number = view.findViewById(R.id.tv_owner_passport_number)
        tv_organization_id = view.findViewById(R.id.tv_organization_id)
        tv_identifier_type = view.findViewById(R.id.tv_identifier_type)
        tv_identifier_type_en = view.findViewById(R.id.tv_identifier_type_en)
        tv_identifier_date = view.findViewById(R.id.tv_identifier_date)
        tv_identifier_number = view.findViewById(R.id.tv_identifier_number)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_copy_passport.setOnClickListener {
            val clipboard = requireContext().getSystemService(Context.CLIPBOARD_SERVICE) as android.content.ClipboardManager
            val clip = android.content.ClipData.newPlainText("label", tv_passport_number.text)
            clipboard.setPrimaryClip(clip)
        }
    }

    /** Ініціалізація StateFlow **/
    private fun initStateFlow() {
        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                passportViewModel.outputPassportDetail.collect { state ->
                    tv_passport_number.text = state.passport_number
                    tv_pet_name.text = state.pet_name
                    tv_pet_name_en.text = state.pet_name_en
                    tv_date_of_birth.text = state.date_of_birth
                    tv_breed.text = state.breed
                    tv_breed_en.text = state.breed_en
                    tv_gender.text = state.gender
                    tv_gender_en.text = state.gender_en
                    tv_color.text = state.color
                    tv_color_en.text = state.color_en
                    tv_species.text = state.species
                    tv_species_en.text = state.species_en
                    tv_owner_passport_number.text = state.owner_passport_number
                    tv_organization_id.text = state.organization_id
                    tv_identifier_type.text = state.identifier_type
                    tv_identifier_type_en.text = state.identifier_type_en
                    tv_identifier_date.text = state.identifier_date
                    tv_identifier_number.text = state.identifier_number

                    setUpdateDatetime(state.update_datetime)
                    setImage(state.img_url)
                }
            }
        }
    }

    /** Встановлення часу оновлення паспорта **/
    private fun setUpdateDatetime(update_datetime: String) {
        val repeatedText = "Паспорт оновлено ${update_datetime} "
        tv_update_datetime.text = repeatedText.repeat(100)
        tv_update_datetime.isSelected = true
    }

    /** Встановлення фото паспорта **/
    private fun setImage(img_url: String) {
        try {
            if (img_url.isNotBlank() && img_url != "https://") {
                Glide.with(requireContext())
                    .load(img_url)
                    .error(R.drawable.icon_empty_image)
                    .into(iv_photo)
            } else {
                iv_photo.setImageResource(R.drawable.icon_empty_image)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            iv_photo.setImageResource(R.drawable.icon_empty_image)
        }
    }
}
