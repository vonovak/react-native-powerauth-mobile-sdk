/*
 * Copyright 2021 Wultra s.r.o.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Class representing a multi-factor authentication object.
 */
export class PowerAuthAuthentication {
    /** Indicates if a possession factor should be used. */
    usePossession: boolean = false;
    /** Indicates if a biometry factor should be used. */
    useBiometry: boolean = false;
    /** Password to be used for knowledge factor, or nil of knowledge factor should not be used */
    userPassword?: string = null;
    /**
     * Message displayed when prompted for biometric authentication
     */
    biometryMessage: string = null;

    /** (Android only) Title of biometric prompt */
    biometryTitle: string = null;
};