# 목차
- [서비스명](#서비스명)
  * [채愛레시피](#채愛레시피)
- [프로젝트 구성 안내](#프로젝트-구성-안내)
  * [1. 프로젝트 구성도](#1-프로젝트-구성도)
    + [서비스 구조](#서비스-구조)
    + [메인 기능](#메인-기능)
    + [DB diagram](#db-diagram)
  * [2. 나의 역할 및 사용한 기술 스택](#2-나의-역할-및-사용한-기술-스택)
    + [나의 역할](#나의-역할)
    + [사용한 기술 스택](#사용한-기술-스택)
- [작성한 주요 코드](#작성한-주요-코드)
  * [1. 소셜 로그인](#1-소셜-로그인)
  * [2. 레시피 작성](#2-레시피-작성)
- [프로젝트를 진행하며 느낀점 및 아쉬운 점](#프로젝트를-진행하며-느낀점-및-아쉬운-점)
  * [느낀점](#느낀점)
  * [아쉬웠던 점](#아쉬웠던-점)

<br>

# 서비스명
### 채愛레시피
- 채식 입문자들을 위해, 재료 사진 한장을 인공지능 모델로 분석하여 맛있는 채식 레시피를 제공합니다.
- 현재 채식을 하고 있거나 채식에 관심은 있지만 시도해본 적 없는 채식 입문자들을 위해 채식 레시피를 제공하는 서비스입니다. 

<br>  


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
  - [프로젝트 와이어프레임](https://www.figma.com/file/sZVmbrwxm10F5J3Mge2oIq/%EC%B1%84%EC%95%A0%EB%A0%88%EC%8B%9C%ED%94%BC?node-id=0%3A1)
  
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
|기술|특징|
|:---:|:---:|
|Flask|Django에 비해 구현이 간단한 Flask를 이용하였습니다.|
|Flask_sqlalchemy|ORM을 이용해 객체 형식으로 코드를 작성하기 위해 선택하였습니다.|
|MySQL|가장 널리 사용되는 DB이며 준수한 속도를 보장하기 때문에 선택하였습니다.|
|JWT|서버의 무리를 줄이기 위해 세션이 아닌 JWT를 이용하여 사용자 인증을 진행하였습니다.|
|Docker|동일한 환경에서 개발하기 위해 docker-compose를 이용해 개발을 진행하였고 이후에 Azure VM에 배포하였습니다.|
|Nginx|nginx의 리버스 프록시 기능을 이용하여 서비스 아키텍쳐를 설계하였습니다.|

# 작성한 주요 코드  
### 1. 소셜 로그인
- 프론트 서버에서 인가 코드를 먼저 받게 되면 이후에 아래 엔드포인트로 인가코드를 담아서 get요청을 보냅니다.
- 받은 인가코드를 이용해 access_token을 받고 이를 이용해 유저 정보를 얻을 수 있습니다.
- 구글 로그인의 경우 access_token과 같이 유저 정보를 얻기 때문에 유저 정보를 얻기 위한 작업이 필요 없습니다.    
    
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
    
### 2. 레시피 작성
- 데이터베이스 트랜젝션을 이용하여 만약 레시피 정보를 저장하다 에러가 발생하여도 데이터베이스가 꼬이는 일을 방지할 수 있도록 코드를 작성했습니다.
- sqlalchemy의 savepoint를 적용하여 트랜젝션을 구현했습니다.
- Ingredients테이블을 먼저 저장해야 해당 인덱스를 가지고 올 수 있는 문제가 있어서 RecipesIngredients까지 트랜젝션을 완벽하게 구현하지 못한점이 아쉬운 점입니다.
    
```python
# Recipes 테이블과 Categories 테이블, Ingredients테이블, RecipesIngredients테이블에 데이터 저장하기
# Recipes 테이블 저장하기
new_recipe = Recipes(user_id, recipe_name, main_image, cooking_step, cooking_image, serving, time, total_ingredients_for_db)
with Session.begin() as session:
  session.add(new_recipe)
  nested = session.begin_nested()

  # Categories 테이블 저장하기
  for i in range(3):
    if i == 0:
      new_categories_0 = Categories(new_recipe.id, method, 'method')
    elif i == 1:
      new_categories_1 = Categories(new_recipe.id, occation, 'occation')
    else:
      new_categories_2 = Categories(new_recipe.id, kind, 'kind')
  session.add_all([new_categories_0, new_categories_1, new_categories_2])

  recipe_id = new_recipe.id
# 재료와 소스 DB에 넣기
input_ingredients_recipesingredients(vegetables, recipe_id, 1)
input_ingredients_recipesingredients(sauces, recipe_id, 2)
return jsonify({"success": True, "message": "등록완료", "recipe_id": recipe_id})
```    

# 프로젝트를 진행하며 느낀점 및 아쉬운 점
### 느낀점    
- docker-compose를 이용해 처음으로 개발 환경부터 배포까지 마무리한 프로젝트여서 마무리 했다는 부분에서 정말 기뻤던것 같습니다.
- ssl인증을 받기 위해 certbot을 이용했는데 init-letsemcrypt.sh 을 이용해서 ssl 인증키를 받는 과정에서 많은 에러를 거쳤고 끝내 성공해서 다행이었습니다.
- 소셜로그인 인증방식에 대해 기존에는 백엔드에서만 코드를 작성했는데 이번에는 프론트 서버와 연동해서 어떻게 구현하는지 알게 되었습니다.
### 아쉬웠던 점
- 개인적으로 배포할 때 url들을 전부 바꿔주어야 했는데 이 부분을 좀 더 효율적으로 개발 환경과 나눌 수 있는 방법에 대해 찾아봐야 할 것 같습니다.
- nginx의 리버스 프록시 기능을 이용하기 위한 설정을 진행하며 어찌어찌 배포는 성공하였지만 아직 개념적으로 모르는 부분이 많아보여서 앞으로 더 공부해서 제대로 알고 쓸 수 있도록 해야겠다고 느꼈습니다.    
