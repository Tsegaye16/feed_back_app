import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Checkbox,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Paper,
  TableSortLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Survey {
  id: string;
  name: string;
  createdAt: string;
}

const SurveyTable = ({ surveyList }: { surveyList: Survey[] }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = surveyList.map((survey) => survey.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(selected.length > 0 && {
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.primary.main
                : theme.palette.primary.dark,
          }),
        }}
      >
        {selected.length > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {selected.length} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Surveys
          </Typography>
        )}
        {selected.length === 1 && (
          <IconButton>
            <EditIcon />
          </IconButton>
        )}
        {selected.length > 0 && (
          <IconButton>
            <DeleteIcon />
          </IconButton>
        )}
      </Toolbar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="survey table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < surveyList.length
                  }
                  checked={
                    surveyList.length > 0 &&
                    selected.length === surveyList.length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel>Survey ID</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Survey Name</TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Date Created</TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {surveyList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((survey) => {
                const isItemSelected = isSelected(survey.id);
                return (
                  <TableRow
                    hover
                    onClick={() => handleClick(survey.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={survey.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onClick={(event) => handleClick(survey.id)}
                      />
                    </TableCell>
                    <TableCell>{survey.id}</TableCell>
                    <TableCell>{survey.name}</TableCell>
                    <TableCell>
                      {new Date(survey.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent checkbox selection on button click
                          console.log("Viewing details for survey:", survey.id);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={surveyList.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
};

export default SurveyTable;
