import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Grid, Card, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function SharedFilesStatistics({ dataForChart, matches }) {
    const theme = useTheme();

    return (
        <Grid item xs={12} md={4}>
            <Card sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: theme.palette.background.default,
                boxShadow: theme.shadows[4],
            }}>
                <Typography variant="h6" component="h2" sx={{
                    mb: 2,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                }}>
                    Statistiques des fichiers partagés
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: theme.shape.borderRadius,
                    boxShadow: theme.shadows[1],
                }}>
                    <PieChart
                        series={[{ data: dataForChart, label: 'Fichiers partagés' }]}
                        legendPosition="bottom"
                        width={matches ? 390 : 390}
                        height={200}
                    />
                </Box>
            </Card>
        </Grid>
    );
}

export default SharedFilesStatistics;
