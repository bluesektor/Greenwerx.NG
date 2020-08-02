
export class VerificationEntry {

    UUID: string;
    UUIDType: string;

    VerificationDate: Date;



    RecipientUUID: string;
    RecipientProfileUUID: string;
    RecipientAccountUUID: string;
    RecipientIP: string;
    RecipientLocationUUID: string;

    VerifierUUID: string;
    VerifierIP: string;
    VerifierProfileUUID: string;
    VerifierAccountUUID: string;
    VerifierRoleUUID: string;
    VerifierLocationUUID: string;


    VerificationType: string;

    //  role.Category=member.RoleWeight <== of verifying user
    Weight: number;

    // relationshipRole.RoleWeight <== of verifying user
    Multiplier: number;

    // = ((verificationType=inperson,photo..) + weight) * multiplier
     Points: number;

    Deleted: boolean;

    DateDeleted: Date;

    VerifierLatitude: number;
    VerifierLongitude: number;
    RecipientLatitude: number;
    RecipientLongitude: number;

}
