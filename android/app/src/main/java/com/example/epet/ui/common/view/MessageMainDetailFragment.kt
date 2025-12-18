package com.example.epet.ui.common.view

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.addCallback
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.example.epet.R

class MessageMainDetailFragment : Fragment() {

    private val args: MessageMainDetailFragmentArgs by navArgs()

    private lateinit var iv_to_back: ImageView

    private lateinit var tv_tittletext: TextView
    private lateinit var tv_emoji: TextView
    private lateinit var tv_main: TextView
    private lateinit var tv_description: TextView

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_message_main_detail, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        initViews(view)
        initButtons()
        initMessage()
        initButtonBack()
    }

    /** Ініціалізація всіх елементів інтерфейсу **/
    private fun initViews(view: View) {
        iv_to_back = view.findViewById(R.id.iv_to_back)
        tv_tittletext = view.findViewById(R.id.tv_tittletext)
        tv_emoji = view.findViewById(R.id.tv_emoji)
        tv_main = view.findViewById(R.id.tv_main)
        tv_description = view.findViewById(R.id.tv_description)
    }

    /** Ініціалізація всіх кнопок інтерфейсу **/
    private fun initButtons() {
        iv_to_back.setOnClickListener {
            findNavController().popBackStack()
        }
    }

    /** Ініціалізація повідомлення **/
    private fun initMessage() {
        tv_tittletext.setText(args.tittletext)
        tv_emoji.setText(args.emoji)
        tv_main.setText(args.main)
        tv_description.setText(args.description)
    }

    /** Обробка системної кнопки "Назад" **/
    private fun initButtonBack() {
        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner) {
            findNavController().popBackStack()
        }
    }
}