package com.sptech.beatwiseapp.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sptech.beatwiseapp.R
import com.sptech.beatwiseapp.components.Title

@Composable
fun ValuesScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        Title("VALORES")

        Column(modifier = Modifier.padding(16.dp)) {
            ValueCard(
                icone = R.drawable.ic_valor_1,
                texto = "Informação só tem valor quando é fácil de entender. Transformamos dados complexos em algo simples de interpretar."
            )
            Spacer(Modifier.height(16.dp))
            ValueCard(
                icone = R.drawable.ic_valor_2,
                texto = "Acreditamos que boas decisões nascem de dados reais, não de suposições ou \"sempre foi assim\"."
            )
            Spacer(Modifier.height(16.dp))
            ValueCard(
                icone = R.drawable.ic_valor_3,
                texto = "Dados são uma bússola, não uma regra. Nunca substituem a sensibilidade artística, só a orientam."
            )
        }
    }
}

@Composable
private fun ValueCard(icone: Int, texto: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF2A1A3D)),
        border = BorderStroke(1.dp, Color(0xFFA06EE1))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Image(
                painter = painterResource(icone),
                contentDescription = null,
                modifier = Modifier.size(48.dp)
            )
            Spacer(Modifier.height(16.dp))
            Text(
                text = texto,
                color = Color.White,
                fontSize = 17.sp,
                lineHeight = 27.sp,
                textAlign = TextAlign.Center
            )
        }
    }
}