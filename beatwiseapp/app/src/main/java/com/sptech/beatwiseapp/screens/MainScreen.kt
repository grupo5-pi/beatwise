package com.sptech.beatwiseapp.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.sptech.beatwiseapp.Aba
import com.sptech.beatwiseapp.components.BottomBar
import com.sptech.beatwiseapp.components.TopBar


@Composable
fun MainScreen() {
    var abaAtual by rememberSaveable { mutableStateOf(Aba.INICIO) }

    Scaffold(
        containerColor = Color.Black,
        topBar = { TopBar() },
        bottomBar = { BottomBar(abaAtual) { abaAtual = it } }
    ) { padding ->
        Box(modifier = Modifier.padding(padding)) {
            when (abaAtual) {
                Aba.INICIO -> HomeScreen(abrirAba = { abaAtual = it })
                Aba.QUEM_SOMOS -> AboutScreen()
                Aba.VALORES -> ValuesScreen()
                Aba.CONTATO -> ContactScreen()
            }
        }
    }
}