import Pagination from 'src/utils/Pagination';

const paginate = new Pagination(2, 5);

describe('Pagination', () => {
  it('should return query metadata', () => {
    const metadata = paginate.getQueryMetadata();

    expect(metadata.limit).toBe(5);
    expect(metadata.offset).toBe(5);
  });

  it('should return page metadata without extra query if there is no extra query', () => {
    const metadata = paginate.getPageMetadata(22, '/url');

    expect(metadata.prev).toBe('/url?page=1&limit=5');
    expect(metadata.next).toBe('/url?page=3&limit=5');
    expect(metadata.pages).toBe(5);
    expect(metadata.totalItems).toBe(22);
  });

  it('should return page metadata without extra query if there is an extra query', () => {
    const metadata = paginate.getPageMetadata(22, '/url', 'date=2018-08-01');

    expect(metadata.prev).toBe('/url?date=2018-08-01&page=1&limit=5');
    expect(metadata.next).toBe('/url?date=2018-08-01&page=3&limit=5');
    expect(metadata.pages).toBe(5);
    expect(metadata.totalItems).toBe(22);
  });
});
