'use client';

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
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
} from '@mui/material';
import { Add, ArrowBack, Delete, Edit } from '@mui/icons-material';
import jwt from 'jsonwebtoken';
import axios from 'axios';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function CustomPaginationActionsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [food, setFood] = useState('');
  const [isCreate, setIsCreate] = useState(false);
  const [foodId, setFoodId] = useState('');
  const [foodIndex, setFoodIndex] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState('');

  const handleClose = () => {
    setOpen(false);
    setFood('');
    setFoodId('');
    setFoodIndex(0);
    setIsDelete(false);
    setIsEdit(false);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const access = window.localStorage.getItem('accessToken') || '';
    const refresh = window.localStorage.getItem('refreshToken') || '';

    // axios.interceptors.request.use(
    //   (config) => {
    //     config.headers['access'] = `${window.localStorage.getItem('accessToken')}`;
    //     // config.headers['refresh'] = `${refresh}`;

    //     return config;
    //   },
    //   (error) => {
    //     return Promise.reject(error);
    //   },
    // );

    // axios.interceptors.response.use(
    //   (data) => {
    //     if (data.data.type === 'token') {
    //       if (data.data.message === 'Access Token Expired.') {
    //         window.localStorage.removeItem('accessToken');
    //         window.localStorage.removeItem('refreshToken');
    //         window.location.href = '/';
    //         const prevRequest = data?.config;
    //         axios
    //           .get('/api/users/refresh', {
    //             headers: { refresh: refresh },
    //           })
    //           .then((res) => {
    //             const info = res.data;
    //             console.log('info', info);

    //             if (info.success) {
    //               window.localStorage.setItem('accessToken', info.data.accessToken);
    //               console.log(prevRequest.url);

    //               axios(prevRequest).then((data) => {
    //                 console.log('datadtatad', data);
    //               });
    //             }
    //           });
    //       } else {
    //         window.localStorage.removeItem('accessToken');
    //         window.localStorage.removeItem('refreshToken');
    //         window.location.href = '/';
    //       }
    //     } else {
    //       return data;
    //     }
    //     return data;
    //   },
    //   (error) => {
    //     return Promise.reject(error);
    //   },
    // );

    if (access === '' || refresh === '') {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }

    const decodedAccess: any = jwt.decode(access);
    setUser(decodedAccess.id);

    axios.get('/api/foods/getfoodlist').then((data) => {
      const info = data.data;
      console.log(info);

      setRows(info.data.reverse());
    });
  }, []);

  const createFood = () => {
    const access = window.localStorage.getItem('accessToken') || '';

    const decodedAccess: any = jwt.decode(access);

    const foodData = {
      food: food,
      creator: decodedAccess.id,
    };
    if (isCreate) {
      axios.post('/api/foods/create', foodData).then((data) => {
        const info = data.data;

        if (info.success) {
          setRows(info.data.reverse());
          setOpen(false);
          setFood('');
          setIsCreate(false);
        } else {
          alert(info.message);
        }
      });
    } else {
      axios.put(`/api/foods/update/${foodId}`, foodData).then((data) => {
        const info = data.data;

        if (info.success) {
          rows[foodIndex].food = info.data;
          setFoodIndex(0);
          setFoodId('');
          setOpen(false);
          setIsEdit(false);
        }
      });
    }
    // }
  };

  const editFood = (id: any, index: any) => {
    const realIndex = index + page * rowsPerPage;

    setFoodId(id);
    setFoodIndex(realIndex);
    setOpen(true);
    setIsEdit(true);
    setFood(rows[realIndex].food);
  };

  const deleteFood = () => {
    axios.delete(`/api/foods/delete/${foodId}`).then((data) => {
      const info = data.data;

      if (info.success) {
        rows.splice(foodIndex, 1);
        setOpen(false);
        setFoodId('');
        setFoodIndex(0);
        setIsDelete(false);
      }
    });
  };

  return (
    <Box className="relative">
      <Link href="/" className="absolute top-10 left-10 flex items-center text-lg hover:text-blue-700 p-2">
        <ArrowBack /> back
      </Link>
      <Box
        className="absolute top-10 right-10 flex items-center text-lg p-2 cursor-pointer bg-blue-600 text-white rounded-lg"
        onClick={() => {
          setOpen(true);
          setIsCreate(true);
        }}
      >
        <Add />
        Create
      </Box>
      <Container className="flex flex-col justify-around items-center pt-24">
        <p className=" text-8xl mb-20">Food List</p>
        <TableContainer component={Paper} sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
          <Table stickyHeader sx={{ minWidth: 500 }} aria-label="sticky custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>Food</TableCell>
                <TableCell>Creator</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
                (row, index) => (
                  <TableRow key={row.index}>
                    <TableCell component="th" scope="row">
                      {row.food}
                    </TableCell>
                    <TableCell style={{ width: '35%' }}>{row.creator.id}</TableCell>
                    <TableCell style={{ width: 160 }} align="center">
                      <IconButton
                        disabled={row.creator.id === user ? false : true}
                        aria-label="delete"
                        color="primary"
                        onClick={() => editFood(row._id, index)}
                      >
                        {/* {isEdit ? <Check /> : <Edit />} */}
                        <Edit />
                      </IconButton>
                      &nbsp;&nbsp;
                      <IconButton
                        disabled={row.creator.id === user ? false : true}
                        aria-label="delete"
                        color="error"
                        onClick={() => {
                          setOpen(true);
                          setFoodId(row._id);
                          setFoodIndex(index + page * rowsPerPage);
                          setIsDelete(true);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ),
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
          colSpan={3}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          slotProps={{
            select: {
              inputProps: {
                'aria-label': 'rows per page',
              },
              native: true,
            },
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
          sx={{
            width: '100%',
          }}
        />
      </Container>
      {open && isDelete && (
        <Fragment>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                If you want to delete this food, press AGREE. Or not, press DISAGREE.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Disagree
              </Button>
              <Button onClick={deleteFood} color="error" autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
      {open && (isEdit || isCreate) && (
        <Fragment>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{isEdit ? 'Update Food' : 'Create Food'}</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Food Name"
                className="mb-20 mt-5"
                id="food"
                type=""
                defaultValue={food}
                onChange={(e) => setFood(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={createFood} autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </Box>
  );
}
