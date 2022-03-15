# 서비스명
### 채愛레시피
- 채식 입문자들을 위해, 재료 사진 한장을 인공지능 모델로 분석하여 맛있는 채식 레시피를 제공합니다.
- 현재 채식을 하고 있거나 채식에 관심은 있지만 시도해본 적 없는 채식 입문자들을 위해 채식 레시피를 제공하는 서비스입니다. 

[팀 노션 페이지](https://www.notion.so/8-Wiki-4958a75d092d4898b1ec5ccb4f16ecd4)

# 프로젝트 구성 안내
### 1. 프로젝트 구성도
  #### 서비스 구조
  - nginx의 프록시 기능을 이용하여 /api는 백엔드 서버로 나머지는 프론트 서버로 요청을 보내게 설정하였습니다.
  - 백엔드, 프론트엔드, DB는 모두 docker 이미지로 만들어 docker-compose 로 관리하였으며 Azure VM에 배포하였습니다.

  <centor><img src="https://user-images.githubusercontent.com/91299082/158382801-9ae8ba39-c212-41a3-8a33-d89e86437db4.png" width="80%" height="80%">
  
  #### 메인 기능
  - 재료 사진을 업로드 하면 해당 재료로 만들 수 있는 레시피를 제공해 줍니다.
  - 재료를 검색하면 해당 재료로 만들 수 있는 레시피를 제공해 줍니다.
  - 자신만의 레시피를 등록할 수 있습니다.
  
  <centor><img src="https://user-images.githubusercontent.com/91299082/158384954-b61e4dd8-446b-48b1-b9e4-77babe033fbb.png" width="80%" height="400">

  #### DB diagram
       
  <centor><img src="https://user-images.githubusercontent.com/91299082/158386254-396b3828-a0bd-4a66-926c-905862f46bca.png" width="80%" height="400">

### 2. 나의 역할 및 사용한 기술 스택
#### 나의 역할
  - docker-compose를 이용하여 개발 환경 세팅 및 배포 진행
  - 로컬과 카카오, 구글을 이용한 소셜 로그인 및 회원가입 api 구현
  - 레시피 작성 및 삭제 api 구현
  - 아래 구조는 제가 작성한 코드들만 나타낸 구조입니다.
```
project
|---  server
|       |--- routes
|       |     |---login.py
|       |     |---socialLogin.py
|       |     |---recipeBoard.py
|       |     |---updateRecipe.py
|       |--- Dockerfile
|       |--- Dockerfile-dev
|       |--- models.py
|       |--- app.py    
|
|---  nginx
|       |--- Dockerfile
|       |--- default.conf
|
|--- mysql
|       |--- Dockerfile
|       |--- initialize.sql
|       |--- my.cnf
|
|--- docker-compose.yml        // certbot을 통해 ssl 키를 받기 위한 docker-compose 파일
|--- docker-compose-dev.yml    // 개발환경을 위한 docker-compose 파일
|--- docker-compose-dep.yml    // ssl 인증키를 받은 후 배포를 위한 docker-compose 파일 
```
#### 사용한 기술 스택
- **Flask**, **Flask-SQLAlchemy**, **Docker**, **MySQL**, **Nginx**

# 작성한 주요 코드
1. 소셜 로그인
- 프론트 서버에서 인가 코드를 먼저 받게 되면 이후에 아래 엔드포인트로 인가코드를 담아서 get요청을 보냅니다.
- 받은 인가코드를 이용해     
```python
# 카카오로그인 콜백 라우터
@social_login_page_api.route('/callback/kakao')
class CallbackKakao(Resource):
  def get(self):
    try:
      # 인가 코드 받기
      code = request.args['code']
      client_id = os.environ['KAKAO_RESTAPI_KEY']
      redirect_uri = os.environ['KAKAO_REDIRECT_URL']
      
      # 토큰 받기
      kakao_oauthurl = 'https://kauth.kakao.com/oauth/token'
      data = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'code': code,
      }
      token_request = requests.post(kakao_oauthurl, data)
      token_json = token_request.json()
      access_token = token_json['access_token']

      # 토큰을 통해 유저 정보 요청하기
      kakao_info_url = 'https://kapi.kakao.com/v2/user/me'
      request_header = {
        'Authorization': f"Bearer {access_token}"
      }
      info_request = requests.get(kakao_info_url, headers=request_header)
      data = info_request.json()

      nickname = data['properties']['nickname']

      # 닉네임을 가지고 회원가입 및 로그인 진행
      jwt_token = register_and_token(nickname, 'kakao')
      return jsonify({'success': True, 'message': '로그인 성공', 'jwt': jwt_token})
    except Exception as e:
      return jsonify({'success': False, 'message': '서버 내부 에러'})
    
    
```
    
    
    
    
    
