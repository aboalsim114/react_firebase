// SharedFilesGrid.jsx
import React from 'react';
import { Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function SharedFilesGrid({ rows, columns }) {
    return (
        <>
            <Typography variant="h6" gutterBottom component="div">
                Fichiers partagés avec moi
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    sx={{
                        '& .MuiDataGrid-cell': {
                            color: 'var(--primary-text-color-light)',
                            backgroundColor: 'var(--background-color-light)',
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                            '.dark &': {
                                color: 'var(--primary-text-color-dark)',
                                backgroundColor: 'var(--background-color-dark)',
                            },
                        },
                        '& .MuiDataGrid-columnHeader': {
                            color: 'var(--primary-text-color-light)',
                            backgroundColor: 'var(--background-color-light)',
                            '.dark &': {
                                color: 'var(--primary-text-color-dark)',
                                backgroundColor: 'var(--background-color-dark)',
                            },
                        },
                    }}
                />
            </Box>
        </>
    );
}

export default SharedFilesGrid;
