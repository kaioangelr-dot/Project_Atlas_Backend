const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  mapIdParams,
  validateNewMap,
  validateMapUpdate,
} = require('../validations/mapValidation');
const {
  getMaps,
  getMap,
  createMap,
  updateMap,
  deleteMap,
  likeMap,
  unlikeMap,
} = require('../controllers/maps');

router.get('/', getMaps);
router.post('/', auth, validateNewMap, createMap);
router.get('/:mapId', mapIdParams, getMap);
router.patch('/:mapId', auth, mapIdParams, validateMapUpdate, updateMap);
router.delete('/:mapId', auth, mapIdParams, deleteMap);
router.put('/:mapId/likes', auth, mapIdParams, likeMap);
router.delete('/:mapId/likes', auth, mapIdParams, unlikeMap);

module.exports = router;
