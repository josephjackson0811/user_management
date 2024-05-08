"use client";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableHead,
  TextField,
} from "@mui/material";
import axios from "axios";
import { Check, Delete, Edit } from "@mui/icons-material";
import jwt from "jsonwebtoken";

import { config } from "@/config";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

interface UserData {
  _id: string;
  id: string;
  name: string;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function CustomPaginationActionsTable() {
  const [rows, setRows] = useState<UserData[]>([]);
  const [page, setPage] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [deletedUser, setDeletedUser] = useState(0);

  const handleClose = () => {
    setOpen(false);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const editUser = (row_id: any, row_name: any, index: number) => {
    const access = window.localStorage.getItem("accessToken") || "";
    const refresh = window.localStorage.getItem("refreshToken") || "";

    const decoded: any = jwt.decode(refresh);

    if (!isEdit) {
      setIsEdit(true);
      setName(row_name);
      setId(row_id);
    } else {
      const userData = {
        _id: rows[index]._id,
        id: id,
        name: name,
        access: access,
        refresh: refresh,
      };

      console.log(decoded);

      if (access === decoded.accessToken) {
        const decodedAccess: any = jwt.decode(access);

        if (
          decodedAccess.id === userData.id &&
          decodedAccess.name === userData.name
        ) {
          console.log("sdfsdf");
          setIsEdit(false);
        } else {
          axios.put("/api/users/update", userData).then((data) => {
            const info = data.data;

            if (info.success) {
              window.localStorage.setItem("accessToken", info.data.accessToken);
              window.localStorage.setItem(
                "refreshToken",
                info.data.refreshToken
              );

              rows[index].name = name;
              rows[index].id = id;
              setName("");
              setId("");
              setIsEdit(false);
            } else {
              alert(info.message);
            }
          });
        }
      }
    }
  };

  const deleteUser = () => {
    const access = window.localStorage.getItem("accessToken") || "";
    const refresh = window.localStorage.getItem("refreshToken") || "";

    const decoded: any = jwt.decode(refresh);
    if (access === decoded.accessToken) {
      const decodedAccess: any = jwt.decode(access);

      axios.delete(`api/users/delete/${rows[deletedUser]._id}`).then((data) => {
        const info = data.data;

        if (info.success) {
          if (decodedAccess.id === rows[deletedUser].id) {
            window.localStorage.removeItem("accessToken");
            window.localStorage.removeItem("refreshToken");
            alert("");
            window.location.href = "/";
          } else {
            console.log(deletedUser);
            rows.splice(deletedUser, 1);
            setOpen(false);
            setDeletedUser(0);
          }
        }
      });
    }
  };

  useEffect(() => {
    const access = window.localStorage.getItem("accessToken") || "";
    const refresh = window.localStorage.getItem("refreshToken") || "";

    const decoded: any = jwt.decode(refresh) || { accessToken: "" };

    if (access && access === decoded.accessToken) {
      axios.get("/api/users/getuserlist").then((data) => {
        const info = data.data.data;

        setRows(info);
      });
    } else {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      window.location.href = "/";
    }
  }, []);

  return (
    <Box>
      <Container>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {isEdit ? (
                      <TextField
                        id="name"
                        label="Edit User Name"
                        defaultValue={row.name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    ) : (
                      row.name
                    )}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ width: "35%" }}
                  >
                    {isEdit ? (
                      <TextField
                        id="id"
                        label="Edit User ID"
                        defaultValue={row.id}
                        onChange={(e) => setId(e.target.value)}
                      />
                    ) : (
                      row.id
                    )}
                  </TableCell>
                  {/* <TableCell>{row.id}</TableCell> */}
                  <TableCell style={{ width: 160 }} align="center">
                    <IconButton
                      aria-label="delete"
                      color="primary"
                      onClick={() => editUser(row.id, row.name, index)}
                    >
                      {isEdit ? <Check /> : <Edit />}
                    </IconButton>
                    &nbsp;&nbsp;
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => {
                        setOpen(true);
                        setDeletedUser(index);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Container>
      {open && (
        <Fragment>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                If you want to delete this user, press AGREE. Or not, press
                DISAGREE.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Disagree
              </Button>
              <Button onClick={deleteUser} color="error" autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </Box>
  );
}
