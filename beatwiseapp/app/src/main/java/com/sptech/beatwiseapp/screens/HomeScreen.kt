package com.sptech.beatwiseapp.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.sptech.beatwiseapp.Aba
import com.sptech.beatwiseapp.ui.theme.LightPurple
import com.sptech.beatwiseapp.ui.theme.PurpleCard
import com.sptech.beatwiseapp.R


@Composable
fun HomeScreen(abrirAba: (Aba) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Image(
            painter = painterResource(R.drawable.banner),
            contentDescription = "Banner BeatWise",
            contentScale = ContentScale.FillWidth,
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
        )

        Spacer(Modifier.height(24.dp))
        Text("Explore", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(12.dp))

        Atalho("Quem somos", "Aproximar dados e música", Icons.Default.Info) { abrirAba(Aba.QUEM_SOMOS) }
        Atalho("Valores", "Informação, dados e criatividade", Icons.Default.Favorite) { abrirAba(Aba.VALORES) }
        Atalho("Contato", "Feedback, sugestões e dúvidas", Icons.Default.Email) { abrirAba(Aba.CONTATO) }
    }
}

// Uma linha clicável que leva para outra aba
@Composable
private fun Atalho(titulo: String, subtitulo: String, icone: ImageVector, aoClicar: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 12.dp)
            .background(PurpleCard, RoundedCornerShape(14.dp))
            .clickable { aoClicar() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icone, contentDescription = null, tint = LightPurple)
        Column(modifier = Modifier.weight(1f).padding(horizontal = 14.dp)) {
            Text(titulo, color = Color.White, fontSize = 17.sp, fontWeight = FontWeight.SemiBold)
            Text(subtitulo, color = Color.White.copy(alpha = 0.7f), fontSize = 14.sp)
        }
    }
}