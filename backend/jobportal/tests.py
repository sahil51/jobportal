from rest_framework.test import APITestCase


class JobCrudTests(APITestCase):
    def test_multipart_crud_with_json_fields(self):
        created = self.client.post(
            '/api/jobs/',
            {
                'title': 'API CRUD check',
                'status': '["Posted"]',
                'category': '["Full-time"]',
                'start_date': '2026-03-01',
                'end_date': '2026-03-31',
            },
            format='multipart',
        )

        self.assertEqual(created.status_code, 201)
        job = created.data
        self.assertEqual(job['status'], ['Posted'])
        self.assertEqual(job['category'], ['Full-time'])

        updated = self.client.put(
            '/api/jobs/{}/'.format(job['id']),
            {
                'title': 'Updated API CRUD check',
                'status': '["Draft"]',
                'category': '["Remote"]',
                'start_date': '',
                'end_date': '',
            },
            format='multipart',
        )

        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.data['title'], 'Updated API CRUD check')
        self.assertEqual(updated.data['status'], ['Draft'])
        self.assertEqual(updated.data['category'], ['Remote'])
        self.assertIsNone(updated.data['start_date'])
        self.assertIsNone(updated.data['end_date'])

        deleted = self.client.delete('/api/jobs/{}/'.format(job['id']))
        self.assertEqual(deleted.status_code, 204)
        self.assertEqual(self.client.get('/api/jobs/{}/'.format(job['id'])).status_code, 404)
