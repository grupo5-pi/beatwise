package com.sptech.beatwiseapp.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sptech.beatwiseapp.R
import com.sptech.beatwiseapp.components.Title
import com.sptech.beatwiseapp.ui.theme.LightPurple

@Composable
fun AboutScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Title("QUEM SOMOS")
        Spacer(Modifier.height(32.dp))

        Image(
            painter = painterResource(R.drawable.beatwise_headphone),
            contentDescription = "BeatWise",
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .size(240.dp)
                .clip(CircleShape)
                .border(3.dp, LightPurple, CircleShape)
        )

        Spacer(Modifier.height(32.dp))

        Text(
            text = "A BeatWise nasceu da vontade de aproximar dados e música — de dar à indústria " +
                    "musical uma forma mais clara de enxergar o próprio público.",
            color = Color.White,
            fontSize = 18.sp,
            lineHeight = 30.sp,
            textAlign = TextAlign.Justify,
            modifier = Modifier.padding(horizontal = 24.dp)
        )

        Spacer(Modifier.height(20.dp))

        Text(
            text = "Nosso objetivo é simples: ajudar quem vive de música a tomar decisões mais " +
                    "seguras, trocando o achismo pela evidência, sem nunca abrir mão da " +
                    "criatividade que move essa indústria.",
            color = Color.White,
            fontSize = 18.sp,
            lineHeight = 30.sp,
            textAlign = TextAlign.Justify,
            modifier = Modifier.padding(horizontal = 24.dp, vertical = 0.dp)
        )

        Spacer(Modifier.height(32.dp))
    }
}