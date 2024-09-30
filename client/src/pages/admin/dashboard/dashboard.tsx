import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  List,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider,
  Typography,
  Badge,
  Box,
  ListItemButton,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DraftsIcon from "@mui/icons-material/Drafts";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import PollIcon from "@mui/icons-material/Poll";
import FeedbackIcon from "@mui/icons-material/Feedback";
import Person4Icon from "@mui/icons-material/Person4";
import Draft from "../serveys/draft";
import Published from "../serveys/published";
import Detail from "../serveys/detail";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [isServeysOpen, setIsServeysOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null); // Add state for detail

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: string) => {
    setSelectedItem(item);
    setSelectedDetail(null); // Reset detail when switching menus
  };

  const handleServeysClick = () => {
    setIsServeysOpen(!isServeysOpen);
  };

  const handleDetailClick = (id: number) => {
    setSelectedDetail(id);
  };
  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar/Navbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "aliceblue",
          color: "black",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={handleAvatarClick}>
            <Avatar alt="User Avatar" src="/avatar.png" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            keepMounted
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Person4Icon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar/Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: isSidebarOpen ? 240 : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isSidebarOpen ? 240 : 60,
            transition: "width 0.3s",
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {/* Dashboard Item */}
          <ListItemButton
            selected={selectedItem === "Dashboard"}
            onClick={() => handleMenuItemClick("Dashboard")}
            sx={{
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
              "&.Mui-selected": {
                backgroundColor: "#e0e0e0",
                "&:hover": {
                  backgroundColor: "#d0d0d0",
                },
              },
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Dashboard" />}
          </ListItemButton>

          {/* Serveys Item with Collapse */}
          <ListItemButton
            onClick={handleServeysClick}
            sx={{
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <ListItemIcon>
              <PollIcon />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Serveys" />}
            {isServeysOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={isServeysOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* Published Item */}
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedItem === "Published"}
                onClick={() => handleMenuItemClick("Published")}
              >
                <ListItemIcon>
                  <PublishedWithChangesIcon />
                </ListItemIcon>
                <ListItemText primary="Published" />
              </ListItemButton>

              {/* Draft Item */}
              <ListItemButton
                sx={{ pl: 4 }}
                selected={selectedItem === "Draft"}
                onClick={() => handleMenuItemClick("Draft")}
              >
                <ListItemIcon>
                  <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Draft" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* FeedBacks */}
          <ListItemButton
            selected={selectedItem === "FeedBacks"}
            onClick={() => handleMenuItemClick("FeedBacks")}
            sx={{
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
              "&.Mui-selected": {
                backgroundColor: "#e0e0e0",
                "&:hover": {
                  backgroundColor: "#d0d0d0",
                },
              },
            }}
          >
            <ListItemIcon>
              <FeedbackIcon />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Feed Backs" />}
          </ListItemButton>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: isSidebarOpen ? "1px" : "1px",
          transition: "margin 0.3s",
        }}
      >
        <Toolbar />
        {selectedDetail ? (
          <Detail id={selectedDetail} /> // Render the Detail component when a survey is selected
        ) : (
          <>
            {selectedItem === "Dashboard" && <div>Dashboard Content</div>}

            {selectedItem === "Published" && (
              <Published onDetailClick={handleDetailClick} />
            )}

            {selectedItem === "Draft" && (
              <Draft onDetailClick={handleDetailClick} />
            )}

            {selectedItem === "FeedBacks" && <div>FeedBacks Content</div>}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
