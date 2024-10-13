import { render, screen, waitFor } from '@testing-library/react';
import LawnRecommendationsDashboard from './LawnRecommendationsDashboard';
import axios from 'axios';

jest.mock('axios');

test('displays recommendations after successful API call', async () => {
  const mockData = [
    { id: 1, title: 'Recommendation 1', description: 'Desc 1', image: '/img1.jpg' },
    { id: 2, title: 'Recommendation 2', description: 'Desc 2', image: '/img2.jpg' }
  ];
  axios.post.mockResolvedValueOnce({ data: mockData });

  render(<LawnRecommendationsDashboard formData={{ /* mock form data */ }} />);

  expect(screen.getByText(/Loading recommendations.../i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Recommendation 1')).toBeInTheDocument();
    expect(screen.getByText('Recommendation 2')).toBeInTheDocument();
  });
});

test('displays error message on API failure', async () => {
  axios.post.mockRejectedValueOnce(new Error('API Error'));

  render(<LawnRecommendationsDashboard formData={{ /* mock form data */ }} />);

  expect(screen.getByText(/Loading recommendations.../i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/Failed to fetch recommendations/i)).toBeInTheDocument();
  });
});