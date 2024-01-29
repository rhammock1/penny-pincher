import db from '../../db.js';

export const getClassifiers = async () => {
  const { rows: classifiers } = await db.file('db/classifiers/get.sql');
  return classifiers;
}

export const getClassifierTypes = async () => {
  const { rows: classifier_types } = await db.file('db/classifiers/get_enum.sql');
  const types = classifier_types.map(({ classifier_type }) => classifier_type);
  return types;
}

export const insertClassification = async ({classifier, classifier_type, classifier_descriptor}) => {
  await db.file('db/classifiers/put.sql', { classifier, classifier_type, classifier_descriptor });
};
