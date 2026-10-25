package com.sptech.beatwiseapp.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.sptech.beatwiseapp.ui.theme.PurpleBorder
import com.sptech.beatwiseapp.ui.theme.PurpleCard

@Composable
fun Card(modifier: Modifier = Modifier, conteudo: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(PurpleCard, RoundedCornerShape(16.dp))
            .border(1.dp, PurpleBorder, RoundedCornerShape(16.dp))
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        content = conteudo
    )
}