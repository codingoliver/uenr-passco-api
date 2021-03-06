var UserModel = require('../model/UserModel');
const nodemailer = require("nodemailer");

const user = {

    /**
    * Add new user
    * 
    * @param {Object} request HttpRequest
    * @param {Object} response HttpResponse
    * @param {Object} next Next Callable
    */
    store(request, response, next) {

        new UserModel({
            email: request.body.email,
            password: request.body.password,
            name: request.body.name,
            contact: request.body.contact,
            programme: request.body.programme,
            referral_email: request.body.referral_email
        }).save()
            .then(doc => {
                return response.status(200).json({
                    status: 'success',
                    doc
                });
            })
            .catch(err => {
                return response.status("401").json({
                    status: 'failure',
                    err
                });
            });
    },

    /**
     * Get user info
     * 
     * @param {Object} request HttpRequest
     * @param {Object} response HttpResponse
     * @param {Object} next Next Callable
     */
    show(request, response, next) {

        UserModel.find({
            email: request.param('email'),
            password: request.param('password')
        })
            .then(doc => {
                return response.status(200).json({
                    status: 'success',
                    doc
                });
            })
            .catch(err => {
                return response.status("401").json({
                    status: 'failure',
                    err
                });
            })
    },

    /**
     * Get user id
     * 
     * @param {Object} request HttpRequest
     * @param {Object} response HttpResponse
     * @param {Object} next Next Callable
     */
    get_id(request, response, next) {

        UserModel.find({ referral_email: request.param('referral_email') }).limit(1)
            .then(doc => {
                return response.status(200).json({
                    status: 'success',
                    id: doc[0]._id
                });
            })
            .catch(err => {
                return response.status("401").json({
                    status: 'failure',
                    err
                });
            })
    },

    /**
    * Update user info
    * 
    * @param {Object} request HttpRequest
    * @param {Object} response HttpResponse
    * @param {Object} next Next Callable
    */
    update(request, response, next) {

        UserModel.findOneAndUpdate(
            {
                _id: request.body.user_id
            },
            {
                email: request.body.email,
                password: request.body.password,
                name: request.body.name,
                contact: request.body.contact,
                programme: request.body.programme
            },
            {
                new: true  // return updated doc
            })
            .then(doc => {
                return response.status(200).json({
                    status: 'success',
                    doc
                });
            }).catch(err => {
                return response.status("401").json({
                    status: 'failure',
                    err
                });
            })
    },

    /**
    * Update user password
    * 
    * @param {Object} request HttpRequest
    * @param {Object} response HttpResponse
    * @param {Object} next Next Callable
    */
    update_password(request, response, next) {

        UserModel.findOneAndUpdate(
            {
                _id: request.body.user_id
            },
            {
                password: request.body.password
            },
            {
                new: true  // return updated doc
            })
            .then(doc => {
                return response.status(200).json({
                    status: 'success',
                    doc
                });
            }).catch(err => {
                return response.status("401").json({
                    status: 'failure',
                    err
                });
            })
    },

    /**
   * Send verification link to email
   * 
   * @param {Object} request HttpRequest
   * @param {Object} response HttpResponse
   * @param {Object} next Next Callable
   */
    sendEmailVerificationLink(request, response, next) {

        const recipientEmail = request.param('email');
        const link = "<a href='http://127.0.0.1:3000/api/v1/user/verifyEmail?email=" + recipientEmail + "'>Verify my email</a>"

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'eddles5.ob@gmail.com',
                pass: '4190bingyman'
            }
        });

        var mailOptions = {
            from: 'UENR PassQo',
            to: recipientEmail,
            subject: 'Verify your email',
            html: "<h1>Hello Technologian</h1>"+
                "<p>Please click on the link below to verify your email and complete the registration for UENR PassQo</p>" +
                link
        };

        console.log(link);

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                return response.status(401).json({
                    status: 'failure',
                    err
                });
            } else {
                return response.status(200).json({
                    status: 'success',
                    response: info.response
                });
            }
        });

    },

    /**
 * Send verification link to email
 * 
 * @param {Object} request HttpRequest
 * @param {Object} response HttpResponse
 * @param {Object} next Next Callable
 */
    verifyEmail(request, response, next) {

        UserModel.findOneAndUpdate(
            {
                email: request.param('email')
            },
            {
                isEmailVerified: true,
            },
            {
                new: true  // return updated doc
            })
            .then(doc => {
                return response.status(200).json({
                    status: 'success',
                    doc
                });
            }).catch(err => {
                return response.status("401").json({
                    status: 'failure',
                    err
                });
            })
    },

}

module.exports = user;