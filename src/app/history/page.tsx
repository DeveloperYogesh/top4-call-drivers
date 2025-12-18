import HistoryList from "@/components/bookings/HistoryList";
import { Box, Container, Typography } from "@mui/material";

export default function HistoryPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2 }}>
        My Bookings
      </Typography>
      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
        <HistoryList />
      </Box>
    </Container>
  );
}
