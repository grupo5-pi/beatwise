package com.sptech.beatwiseapp.screens

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.net.toUri
import com.sptech.beatwiseapp.R
import com.sptech.beatwiseapp.components.Button
import com.sptech.beatwiseapp.components.Card
import com.sptech.beatwiseapp.components.Title
import com.sptech.beatwiseapp.ui.theme.LightPurple

const val EMAIL_CONTATO = "contato@beatwise.com"

// Abre o app de e-mail já com destinatário e assunto preenchidos
fun abrirEmail(context: Context, assunto: String) {
    val intent = Intent(Intent.ACTION_SENDTO)
    intent.data = ("mailto:${EMAIL_CONTATO}?subject=" + Uri.encode(assunto)).toUri()
    try {
        context.startActivity(intent)
    } catch (e: ActivityNotFoundException) {
        Toast.makeText(context, "Nenhum app de e-mail encontrado", Toast.LENGTH_SHORT).show()
    }
}

@Composable
fun ContactScreen() {
    val context = LocalContext.current
    val motivos = listOf("Feedback ou Sugestões", "Saber mais", "Dúvidas")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        Title("CONTATO")

        Card(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Estamos por aqui para ajudar no que precisar.",
                color = Color.White,
                fontSize = 18.sp,
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(16.dp))
            Text(
                text = "Em caso de:",
                color = Color.White,
                fontSize = 16.sp,
                modifier = Modifier.fillMaxWidth()
            )

            // Repete uma linha para cada motivo
            for (motivo in motivos) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { abrirEmail(context, motivo) }
                        .padding(vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("• $motivo", color = Color.White, fontSize = 16.sp, modifier = Modifier.weight(1f))
                    Icon(Icons.Default.KeyboardArrowRight, contentDescription = null, tint = LightPurple)
                }
            }

            Spacer(Modifier.height(20.dp))
            Button(
                texto = "Entre em Contato",
                onClick = { abrirEmail(context, "Contato via app BeatWise") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(Modifier.height(24.dp))
            Image(
                painter = painterResource(R.drawable.logo_b),
                contentDescription = "BeatWise",
                modifier = Modifier.size(110.dp)
            )
        }
    }
}