package com.example.ismr.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.rounded.Visibility
import androidx.compose.material.icons.rounded.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.example.ismr.model.User

@Composable
fun ProfileScreen(modifier: Modifier = Modifier) {
    var user by remember { mutableStateOf(User()) }
    var showPassword by remember { mutableStateOf(false) }


    val handleChangeInUser: (Any, String) -> Unit = { value, field ->
        user = when (field) {
            "displayName" -> user.copy(displayName = value as String)
            "username" -> user.copy(username = value as String)
            "password" -> user.copy(password = value as String)
            else -> user
        }
    }

    LaunchedEffect(Unit) {
        user = User(
            displayName = "Luan Gabriel",
            username = "luangtv",
            password = "1234"
        )
    }

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
                text = "Olá, ${user.displayName}",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            userForm(user = user,
                showPassword = showPassword,
                onShowPasswordToggle = { showPassword = !showPassword },
                onUserChange = handleChangeInUser)
        }
    }
}

@Composable
fun userForm(user: User,
             showPassword: Boolean,
             onShowPasswordToggle: () -> Unit,
             onUserChange: (Any, String) -> Unit,
             modifier: Modifier = Modifier){
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(text = "Nome de Exibição", style = MaterialTheme.typography.labelLarge)
            OutlinedTextField(
                value = user.displayName,
                        onValueChange = { onUserChange(it, "displayName") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                keyboardOptions = KeyboardOptions(
                    capitalization = KeyboardCapitalization.Words
                ),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.secondary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.primaryContainer,
                    focusedLabelColor = MaterialTheme.colorScheme.secondary,
                    unfocusedLabelColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        }

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(text = "Username", style = MaterialTheme.typography.labelLarge)
            OutlinedTextField(
                value = user.username,
                        onValueChange = { onUserChange(it, "username") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                keyboardOptions = KeyboardOptions(
                    capitalization = KeyboardCapitalization.None,
                    autoCorrectEnabled = false
                ),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.secondary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.primaryContainer,
                    focusedLabelColor = MaterialTheme.colorScheme.secondary,
                    unfocusedLabelColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        }

        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(text = "Nova Senha", style = MaterialTheme.typography.labelLarge)
            OutlinedTextField(
                value = user.password,
                        onValueChange = { onUserChange(it, "password") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(
                    capitalization = KeyboardCapitalization.None,
                    keyboardType = KeyboardType.Password
                ),
                trailingIcon = {
                    val image =
                        if (showPassword) Icons.Rounded.Visibility else Icons.Rounded.VisibilityOff
                    val description = if (showPassword) "Ocultar senha" else "Mostrar senha"

                    IconButton(onClick = onShowPasswordToggle) {
                        Icon(imageVector = image, contentDescription = description, tint = MaterialTheme.colorScheme.secondary)
                    }
                },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.secondary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.primaryContainer,
                    focusedLabelColor = MaterialTheme.colorScheme.secondary,
                    unfocusedLabelColor = MaterialTheme.colorScheme.primaryContainer
                )
            )
        }

        Button(
            onClick = {

            },
            modifier = Modifier
                .align(Alignment.End)
                .height(50.dp),

        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.End
            ) {
                Text(text = "Salvar")
                Icon(
                    imageVector = Icons.Default.ChevronRight,
                    contentDescription = null
                )
            }
        }
    }
}