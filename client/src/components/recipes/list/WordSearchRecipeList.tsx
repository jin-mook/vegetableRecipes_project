import styled, { css } from 'styled-components';
import React, { useState, useEffect } from 'react';
import { RecipesLayout } from '../../layout/RecipesLayout';
import { HighLight } from '../../text/Highlight';
import LoadingSpinner from '../../ui/animation/LoadingSpinner';
import { useRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';
import { filterAtom, pageState, recipesState } from '../../../store/store';
import NoneFound from '../../ui/animation/NoneFound';
import { useQuery } from 'react-query';
import RecipeCard from './RecipeCard';
import { ingredientsState } from '../../../store/store';
import { fetchWordSearchResult } from '../../../api/recipes';
import {
  SpinnerContainer,
  SpinnerOverlay,
} from '../../ui/animation/LoadingSpinnerSmall';
import ScrollTopButton from '../../ui/button/ScrollTopButton';

type Props = {};

const WordSearchRecipeList: React.FC<Props> = () => {
  const [target, setTarget] = useState<HTMLDivElement | null>();

  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useRecoilState(pageState);
  const [searchData, setSearchData] = useRecoilState(recipesState);
  const resetFilterData = useResetRecoilState(filterAtom);
  const resetSearchData = useResetRecoilState(recipesState);
  const option = useRecoilValue(filterAtom);

  const ingredients = useRecoilValue(ingredientsState);

  const {
    data: resultRecipe,
    status,
    refetch,
  } = useQuery(
    'search-recipe',
    () => fetchWordSearchResult(ingredients.join('+'), currentPage),
    { cacheTime: 0 }
  );

  useEffect(() => {
    if (status === 'success') {
      if (currentPage <= 1) {
        setSearchData(resultRecipe?.data.recipes);
      } else {
        setSearchData([...searchData, resultRecipe?.data.recipes].flat());
      }
    }
  }, [resultRecipe?.data.recipes]);

  const onIntersect = async ([entry]: any, observer: any): Promise<any> => {
    if (entry.isIntersecting && !isLoading) {
      observer.unobserve(entry.target);
      setIsLoading(true);
      setCurrentPage((prev) => prev + 1);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      refetch();
      setIsLoading(false);
      observer.observe(entry.target);
    }
  };

  useEffect(() => {
    let observer: any;
    if (target) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0.4,
      });
      observer.observe(target);
    }
    return () => {
      observer && observer.disconnect();
      setIsLoading(false);
    };
  }, [target]);

  /* 재 방문시, 필터 리셋 */
  useEffect(() => {
    resetSearchData();
    resetFilterData();
  }, []);

  const filteredRecipes = searchData?.filter((recipe: any) => {
    if (option.kind === '페스코') {
      return (
        recipe.kind === '페스코' ||
        recipe.kind === '락토' ||
        recipe.kind === '오보' ||
        recipe.kind === '비건' ||
        recipe.kind === '락토/오보'
      );
    }
    if (option?.kind === '락토오보') {
      return (
        recipe.kind === '락토' ||
        recipe.kind === '오보' ||
        recipe.kind === '락토/오보'
      );
    }
    return recipe.kind === option?.kind;
  });

  return (
    <>
      <RecipesLayout>
        {isLoading && (
          <>
            <LoadingContainer>
              <h2>레시피를 찾는 중입니다...</h2>
              <LoadingSpinner />
            </LoadingContainer>
          </>
        )}
        {filteredRecipes && !isLoading && (
          <>
            <h2>
              총 <HighLight>{resultRecipe?.data.all_recipe_count}</HighLight>
              건의 레시피를 찾았습니다!
            </h2>
            <hr />
          </>
        )}
        <RecipeListContainer>
          {filteredRecipes &&
            filteredRecipes.map((recipe: any, idx: number) => (
              <RecipeCard
                key={`${recipe.recipe_id}+${idx}`}
                id={recipe.recipe_id}
                image={recipe.main_image}
                title={recipe.name}
                rating={recipe.mean_rating}
                kind={recipe.kind}
              />
            ))}
        </RecipeListContainer>
        <ScrollTopButton />
        {isLoading && (
          <SpinnerOverlay>
            <SpinnerContainer />
          </SpinnerOverlay>
        )}
        <div style={{ textAlign: 'center' }} ref={setTarget}></div>
      </RecipesLayout>
    </>
  );
};

export default WordSearchRecipeList;

const LoadingContainer = styled.div`
  text-align: center;
  height: fit-content;
`;

const RecipeListContainer = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 1rem auto;
  padding: 2rem 2rem;
  background-color: white;
  border-radius: 0.5rem;
  width: 80vw;
  height: 40vh;
  transition: 100ms ease-out;

  ${(recipes) =>
    recipes &&
    css`
      width: fit-content;
      height: fit-content;
    `}

  @media (max-width: 1100px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 970px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 700px) {
    display: grid;
    grid-template-columns: 1fr;
  }
`;
