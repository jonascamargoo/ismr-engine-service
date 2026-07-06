package com.example.ismr.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ismr.ui.UiState
import com.example.ismr.viewmodel.PreferencesViewModel

data class Option(val label: String, val value: String)

// Valores devem casar com o enum AIPersonalityEnum do backend
val PERSONALITY_OPTIONS = listOf(
    Option("Prestativa", "Helpful and polite"),
    Option("Direta", "Short and blunt"),
    Option("Sarcástica", "Sarcastic and humorous"),
    Option("Formal", "Formal and professional")
)
@Composable
fun PreferenceScreen(modifier: Modifier = Modifier, viewModel: PreferencesViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsState()

    when (val estado = uiState) {
        is UiState.Loading -> {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        }
        is UiState.Error -> {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(text = estado.mensagem, color = Color.Red)
                Button(onClick = { viewModel.buscarPreferencias() }) {
                    Text("Tentar novamente")
                }
            }
        }
        is UiState.Success -> {
            val preferences = estado.data
            Column(
                modifier = modifier
                    .fillMaxSize()
                    .background(MaterialTheme.colorScheme.background)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    Text(
                        text = "Preferências",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )

                    Column(modifier = Modifier.padding(bottom = 16.dp, top = 32.dp)) {
                        Text(
                            text = "Personalidade da IA",
                            style = MaterialTheme.typography.bodyLarge,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )

                        FlowRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            PERSONALITY_OPTIONS.forEach { option ->
                                val isActive = preferences.aiPersonality == option.value
                                CustomChip(
                                    label = option.label,
                                    isActive = isActive,
                                    onClick = { viewModel.atualizarPreferencia { currentPrefs ->
                                        currentPrefs.copy(aiPersonality = option.value)
                                    } }
                                )
                            }
                        }
                    }

                    HorizontalDivider(
                        modifier = Modifier.padding(vertical = 16.dp),
                        color = MaterialTheme.colorScheme.primaryContainer
                    )

                    PreferenceRow(
                        label = "Modo de foco",
                        isChecked = preferences.focusModeActive,
                        onCheckedChange = { isChecked ->
                            viewModel.atualizarPreferencia { currentPrefs ->
                                currentPrefs.copy(focusModeActive = isChecked)
                            }
                        }
                    )

                    HorizontalDivider(
                        modifier = Modifier.padding(vertical = 16.dp),
                        color = MaterialTheme.colorScheme.primaryContainer
                    )

                    PreferenceRow(
                        label = "Ocultar dados sensíveis?",
                        isChecked = preferences.hideSensitiveData,
                        onCheckedChange = { isChecked ->
                            viewModel.atualizarPreferencia { currentPrefs ->
                                currentPrefs.copy(hideSensitiveData = isChecked)
                            }
                        }
                    )

                }
            }
        }
    }

}

@Composable
fun PreferenceRow(label: String, isChecked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, style = MaterialTheme.typography.bodyLarge)
        Switch(
            checked = isChecked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(
                checkedThumbColor = MaterialTheme.colorScheme.secondary,
                checkedTrackColor = MaterialTheme.colorScheme.primaryContainer,
                uncheckedThumbColor = MaterialTheme.colorScheme.secondary,
                uncheckedTrackColor = MaterialTheme.colorScheme.primaryContainer,
                uncheckedBorderColor = Color.Transparent
            )

        )
    }
}

@Composable
fun CustomChip(label: String, isActive: Boolean, onClick: () -> Unit) {
    Surface(
        modifier = Modifier.clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        color = if (isActive) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
        contentColor = if (isActive) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
    ) {
        Text(
            text = label,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            style = MaterialTheme.typography.labelLarge
        )
    }
}
