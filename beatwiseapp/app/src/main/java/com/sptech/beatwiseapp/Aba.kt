package com.sptech.beatwiseapp

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.ui.graphics.vector.ImageVector

enum class Aba(val titulo: String, val icone: ImageVector) {
    INICIO("Início", Icons.Default.Home),
    QUEM_SOMOS("Quem somos", Icons.Default.Info),
    VALORES("Valores", Icons.Default.Favorite),
    CONTATO("Contato", Icons.Default.Email)
}