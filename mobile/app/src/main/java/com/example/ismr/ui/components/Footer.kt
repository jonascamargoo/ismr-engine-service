package com.example.ismr.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material.icons.rounded.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.example.ismr.ui.routes.Routes

@Composable
fun Footer(navController: NavController) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Row(
        modifier = Modifier
            .height(80.dp)
            .fillMaxWidth()
            .background(color = MaterialTheme.colorScheme.background)
            .padding(horizontal = 24.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        FooterButton(
            Icons.Outlined.Home,
            Icons.Rounded.Home,
            "Home",
            Routes.HOME,
            currentRoute,
            navController
        )
        FooterButton(
            Icons.Outlined.Settings,
            Icons.Rounded.Settings,
            "Settings",
            Routes.SETTINGS,
            currentRoute,
            navController
        )
        FooterButton(
            Icons.Outlined.Person,
            Icons.Rounded.Person,
            "Profile",
            Routes.PROFILE,
            currentRoute,
            navController
        )
    }
}

@Composable
fun RowScope.FooterButton(
    inactiveIcon: ImageVector,
    activeIcon: ImageVector,
    label: String,
    route: String,
    currentRoute: String?,
    navController: NavController
) {
    val isSelected = currentRoute == route
    IconButton(
        onClick = {
            navController.navigate(route) {
                launchSingleTop = true
                restoreState = true
            }
        },
        modifier = Modifier.weight(1f)
    ) {
        Icon(
            if (isSelected) activeIcon else inactiveIcon,
            label,
            tint = if (isSelected) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.tertiary
        )
    }
}