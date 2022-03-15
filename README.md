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
  * client
    * nginx
    * sourc
    
    
## 5. 사용 기술 스택
- AI : Darknet, OpenCV
- 백엔드 : Flask, Flask-SQLAlchemy, Docker, Mysql, Nginx
- 프론트엔드 : TypeScript, ReactQuery, Recoil, Styled-Components, Axios

## 6. 프로젝트 팀원 역할 분담
| 이름 | 담당 업무 |
| ------ | ------ |
| 유환익 | 팀장/프론트엔드 개발 |
| 정진묵 | 백엔드 개발 |
| 임은비 | 백엔드 개발 |
| 이보연 | 백엔드 개발/데이터 |
| 이영민 | 인공지능 개발 |

**멤버별 responsibility**

1. 유환익: 팀장/프론트엔드 담당

- 개발 일정 관리
- 메인 화면, 검색, 조회 기능 구현
- 로그인/회원가입 기능 구현
- 레시피 가이드 페이지 구현

2. 정진묵: 백엔드 담당

- 레시피 작성 페이지 구현
- 로그인/로그아웃 페이지 구현
- 개발환경 설정 및 배포

3. 임은비: 백엔드 담당
- DB 설계 및 api 명세 작성
- 재료 검색 페이지 구현
- 레시피 검색 페이지 구현

4. 이보연: 백엔드 담당
- DB 설계 및 api 명세 작성
- 레시피 데이터 추출 및 전처리
- 레시피 상세페이지 구현

5. 이영민: 인공지능 담당
- 서비스에 적합한 모델 선정
- 학습 데이터 만들기 - 데이터 선정 + 크롤링/Annotation
- 여러 종류의 AI 모델 학습 및 구현


## 7. 버전
  - 1.0.0

## 8. FAQ
  ### AI
  - 어떤 AI 모델을 사용하였나요?
    - YOLO 계열 중 활발하게 사용되어 온 yolov4 계열을 사용했습니다.
    - https://github.com/AlexeyAB/darknet
  - 총 몇개의 클래스를 탐지 가능한가요?
    - 대중적인 생선, 야채, 과일, 견과류, 소스류 총 70종을 학습시켰습니다.
  - AIHub의 커스텀 annotation 형식을 어떻게 yolo darknet 형식으로 변환 했나요?
    - 직접 코드를 제작하여 변환 했습니다
    - Team8 > ai backup > master branch > dataset_practice_swish > swish_F03_annotation_form_transformer.py 참고
    - 최종 모델 학습에 사용한 코드들은 dataset_practice_swish 폴더에 있습니다. 코드 동작 순서대로 정리해 두었으니 조금이라도 도움이 되었으면 합니다.
    - swish_F03_annotation_form_transformer.py 작동 후 roboflow 사이트에서 annotation 및 augmentation적용 한 후 다음 코드로 넘어갑니다.
    - 학습 완료한 모델을 시험해 볼 때 swish_70_classes_practice.py 파일을 사용하였습니다.
    - roboflow 사용 및 새로운 데이터 추가 없이 기존의 AIHub 데이터셋만 사용하시려면 dataset_practice 폴더 참고하시면 됩니다.
    - https://kdt-gitlab.elice.io/ai_track/class_03/ai_project/team8/ai-backup
  - AI 학습 데이터 annotation 및 augmentation 시킨 방법 : roboflow 사이트 이용
  - 모델은 어디에서 학습시켰나요?
    - google colab pro를 결재하여 학습을 진행하였습니다. 제공되는 하드웨어도 뛰어나고, 편의성도 좋아서 후회한 적 없습니다. 
      특히 google drive와 연동이 가능할 수 있다는 점이 장점 중 하나입니다.
  - 케찹, 칠리소스, 고추장 같은 소스류도 모델이 잘 구분을 하나요?
    - 소스류의 경우 그릇 등에 담겨져 있으면 AI가 잘 학습하지 못해서, 대중적인 공산품 소스의 용기를 따로 크롤링하여 학습시켰습니다.
    - ex) 케찹 : 오뚜기, Heinz,  청정원 케찹 등
