package com.sptech.beatwiseapp.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sptech.beatwiseapp.Aba
import com.sptech.beatwiseapp.ui.theme.DarkPurple
import com.sptech.beatwiseapp.ui.theme.Gradient
import com.sptech.beatwiseapp.ui.theme.LightPurple

@Composable
fun BottomBar(abaAtual: Aba, onClick: (Aba) -> Unit) {
    Column {
        Box(Modifier
            .fillMaxWidth()
            .height(2.dp)
            .background(Gradient))
        NavigationBar(containerColor = Color.Black) {
            for (aba in Aba.entries) {
                NavigationBarItem(
                    selected = abaAtual == aba,
                    onClick = { onClick(aba) },
                    icon = { Icon(aba.icone, contentDescription = aba.titulo) },
                    label = { Text(aba.titulo, fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Color.White,
                        selectedTextColor = LightPurple,
                        indicatorColor = DarkPurple,
                        unselectedIconColor = Color.White.copy(alpha = 0.6f),
                        unselectedTextColor = Color.White.copy(alpha = 0.6f)
                    )
                )
            }
        }
    }
}