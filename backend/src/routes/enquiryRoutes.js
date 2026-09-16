const router=require('express').Router();
const auth=require('../middleware/auth');
const c=require('../controllers/enquiryController');
router.post('/',c.createEnquiry);
router.get('/',auth,c.getEnquiries);
router.get('/:id',auth,c.getEnquiryById);
router.patch('/:id/status',auth,c.updateEnquiryStatus);
router.delete('/:id',auth,c.deleteEnquiry);
module.exports=router;
