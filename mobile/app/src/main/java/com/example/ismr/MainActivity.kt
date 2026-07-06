package com.example.ismr

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.ismr.ui.components.Footer
import com.example.ismr.ui.components.Header
import com.example.ismr.ui.routes.Routes
import com.example.ismr.ui.screens.HomeScreen
import com.example.ismr.ui.screens.LoginScreen
import com.example.ismr.ui.screens.PreferenceScreen
import com.example.ismr.ui.screens.ProfileScreen
import com.example.ismr.ui.theme.IsmrTheme
import com.example.ismr.viewmodel.AuthState
import com.example.ismr.viewmodel.AuthViewModel


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            IsmrTheme {
                val authViewModel: AuthViewModel = viewModel()
                val authState by authViewModel.state.collectAsState()
                // Gate de autenticação: sem sessão -> Login; com sessão -> app.
                if (authState is AuthState.LoggedIn) {
                    Content()
                } else {
                    LoginScreen(authViewModel = authViewModel)
                }
            }
        }
    }
}

@Composable
fun Content(){
    val navController = rememberNavController()

    Scaffold(
        topBar = { Header() },
        bottomBar = { Footer(navController) }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Routes.HOME,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Routes.HOME) { HomeScreen() }
            composable(Routes.SETTINGS) { PreferenceScreen() }
            composable(Routes.PROFILE) { ProfileScreen() }
        }
    }
}
