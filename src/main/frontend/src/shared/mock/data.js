/**
 * 데모용 Mock 데이터
 * 실제 API 연동 시 src/shared/api/*.js의 USE_MOCK 플래그를 false로
 */
export const mockWeather = {
  temp: 18, feelsLike: 18, humidity: 87,
  description: '비', icon: '🌧️', code: 'R-T-N-L'
};

export const mockSituations = [
  { code: 'ALONE', label: '혼밥' },
  { code: 'DATE', label: '데이트' },
  { code: 'PARTY', label: '회식' },
  { code: 'CHEAP', label: '가성비' },
  { code: 'HEAVY', label: '든든한' },
  { code: 'QUICK', label: '빠른 식사' }
];

export const mockTodayPicks = [
  { id: 1, rank: 1, name: '할매국밥 본점', distance: '500m', rating: 4.6, reviewCount: 328, tags: '국밥, 순대', image: '🍲', reason: '비 오는 날씨에 따뜻한 국물이 좋아요!', liked: false },
  { id: 2, rank: 2, name: '홍짬뽕', distance: '1.2km', rating: 4.4, reviewCount: 241, tags: '중식, 짬뽕', image: '🍜', reason: '매콤한 음식이 당기는 날씨에요', liked: false },
  { id: 3, rank: 3, name: '춘천 닭갈비', distance: '1.5km', rating: 4.5, reviewCount: 186, tags: '한식, 닭갈비', image: '🍗', reason: '피곤한 날엔 매콤한 닭갈비 어때요?', liked: false },
  { id: 4, rank: 4, name: '오브 파스타', distance: '1.8km', rating: 4.3, reviewCount: 153, tags: '양식, 파스타', image: '🍝', reason: '든든하면서도 가볍게 즐겨보세요!', liked: false }
];

export const mockCategories = [
  { code: 'KOREAN',   name: '한식', icon: '🍲' },
  { code: 'CHINESE',  name: '중식', icon: '🍜' },
  { code: 'JAPANESE', name: '일식', icon: '🍣' },
  { code: 'WESTERN',  name: '양식', icon: '🍝' },
  { code: 'CHICKEN',  name: '치킨', icon: '🍗' },
  { code: 'SNACK',    name: '분식', icon: '🥘' },
  { code: 'CAFE',     name: '카페/디저트', icon: '☕' },
  { code: 'BAR',      name: '술집', icon: '🍺' }
];

export const mockPersonalPicks = [
  { id: 11, name: '김치찌개 맛집', rating: 4.6, reviewCount: 312, reason: '얼큰한 국물이 생각날 때', image: '🍲', liked: false },
  { id: 12, name: '연어덮밥 맛집', rating: 4.5, reviewCount: 178, reason: '신선한 연어가 땡길 때', image: '🍣', liked: false },
  { id: 13, name: '브런치 카페', rating: 4.4, reviewCount: 215, reason: '여유로운 주말 오전에', image: '🥗', liked: false }
];

export const mockReviews = [
  { id: 101, author: '맛있는여행자', avatar: '맛', rating: 5.0, restaurant: '할매국밥 본점', content: '국물이 진짜 끝내줘요! 비 오는 날 최고', date: '2일 전', thumb: '🍲' },
  { id: 102, author: '김먹보', avatar: '김', rating: 4.5, restaurant: '홍짬뽕', content: '짬뽕 국물이 얼큰하고 해물도 푸짐해요!', date: '3일 전', thumb: '🍜' },
  { id: 103, author: '행복한미식가', avatar: '행', rating: 4.0, restaurant: '춘천 닭갈비', content: '닭갈비 양도 많고 맛있어요~', date: '5일 전', thumb: '🍗' }
];

export const mockRestaurants = [
  ...mockTodayPicks,
  ...mockPersonalPicks,
  { id: 21, name: '한촌설렁탕', distance: '700m', rating: 4.7, reviewCount: 423, tags: '한식, 설렁탕', image: '🍲', liked: false },
  { id: 22, name: '교동짬뽕', distance: '1.0km', rating: 4.3, reviewCount: 198, tags: '중식, 짬뽕', image: '🍜', liked: false },
  { id: 23, name: '스시오마카세', distance: '2.1km', rating: 4.8, reviewCount: 89, tags: '일식, 스시', image: '🍣', liked: false },
  { id: 24, name: 'BHC 본점', distance: '600m', rating: 4.2, reviewCount: 521, tags: '치킨', image: '🍗', liked: false }
];
